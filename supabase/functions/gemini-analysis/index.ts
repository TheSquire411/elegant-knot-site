import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 10, 60000)) { // 10 requests per minute
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestBody = await req.json();
    const { type, imageUrl, style, personalizationData, message, weddingContext, question, budgetData, expenses } = requestBody;
    
    // Input validation
    if (!type || !['analyzeImage', 'generateStory', 'weddingAssistant', 'analyzeBudget'].includes(type)) {
      throw new Error('Invalid request type');
    }
    
    if (type === 'analyzeImage' && !imageUrl) {
      throw new Error('Image URL is required for image analysis');
    }
    
    if (type === 'generateStory' && !personalizationData) {
      throw new Error('Personalization data is required for story generation');
    }
    
    if (type === 'weddingAssistant' && !message) {
      throw new Error('Message is required for wedding assistant');
    }
    
    if (type === 'analyzeBudget' && !question) {
      throw new Error('Question is required for budget analysis');
    }
    
    // Enhanced URL validation for image analysis
    if (type === 'analyzeImage') {
      try {
        const urlObj = new URL(imageUrl);
        
        // Only allow HTTP and HTTPS protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          throw new Error('Only HTTP and HTTPS URLs are allowed');
        }

        // Block localhost and private IPs for security
        const hostname = urlObj.hostname.toLowerCase();
        if (hostname === 'localhost' || 
            hostname.startsWith('127.') || 
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
          throw new Error('Private network URLs are not allowed');
        }

        // Validate file extension for image URLs
        const pathname = urlObj.pathname.toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        if (!imageExtensions.some(ext => pathname.endsWith(ext)) && !pathname.includes('unsplash')) {
          throw new Error('URL must point to a valid image file');
        }

      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Invalid image URL format');
        }
        throw error;
      }
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY')

    if (!geminiApiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured')
    }

    let prompt = ''
    let parts: any[] = []
    
    if (type === 'analyzeImage') {
      // For image analysis, we need to fetch the image and convert to base64
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image');
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
        
        parts = [
          {
            text: `You are a wedding planning assistant. Analyze the wedding inspiration image provided and return a detailed analysis in the specified JSON format.

Based ONLY on the image provided, provide a detailed analysis in this exact JSON format:
{
  "style": "Brief style description",
  "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "mood": "Mood description",
  "elements": ["element1", "element2", "element3"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Focus on wedding planning aspects like style, color palette, mood, design elements, and practical suggestions for couples planning their wedding.`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ];
      } catch (error) {
        throw new Error(`Failed to process image: ${error.message}`);
      }
    } else if (type === 'generateStory') {
      const data = personalizationData;
      const theme = data.theme || {};
      const primaryColor = theme.colors?.[0] || '#F8BBD9';
      const headingFont = theme.fonts?.heading || 'Playfair Display';
      const bodyFont = theme.fonts?.body || 'Montserrat';
      
      prompt = `You are a wedding planning assistant creating a personalized love story in formatted HTML.

COUPLE INFORMATION:
- Names: ${data.coupleNames || 'The Happy Couple'}
- Wedding Date: ${data.weddingDate || 'their special day'}
- Venue: ${data.venue || 'a beautiful venue'}
- Style: ${data.weddingStyle || 'romantic'}
- Length: ${data.storyLength || 'medium'}

PERSONAL DETAILS:
- How they met: ${data.howMet || 'Not provided'}
- First date/early memory: ${data.firstDate || 'Not provided'}
- Proposal story: ${data.proposal || 'Not provided'}
- Shared interests: ${data.sharedInterests || 'Not provided'}
- Special memories: ${data.specialMemories || 'Not provided'}

THEME STYLING:
- Primary color: ${primaryColor}
- Heading font: ${headingFont}
- Body font: ${bodyFont}

Create a beautiful, personalized love story using the provided information. Return ONLY formatted HTML that includes:

1. Use the personal details to craft a unique, emotional story
2. Include 2-4 paragraphs based on the requested length
3. Apply inline styling using the theme colors and fonts
4. Use proper HTML structure with <p> tags for paragraphs
5. Add emphasis with <strong> and <em> tags where appropriate
6. Style the text with the provided fonts and colors

Example format:
<div style="font-family: '${bodyFont}', sans-serif; color: #333; line-height: 1.8;">
  <p style="margin-bottom: 1.5rem;">First paragraph...</p>
  <p style="margin-bottom: 1.5rem;">Second paragraph...</p>
</div>

Make the story romantic, personal, and inspiring. Include specific details from their relationship when provided.`;

      parts = [{ text: prompt }];
    } else if (type === 'weddingAssistant') {
      // Sanitize user message
      const sanitizedMessage = message.substring(0, 500).replace(/[<>"']/g, '');
      const contextSummary = weddingContext ? `
        Budget Overview:
        - Total Budget: $${weddingContext.totalBudget || 0}
        - Total Spent: $${weddingContext.totalSpent || 0}
        - Remaining: $${weddingContext.remainingBudget || 0}
        - Number of Budgets: ${weddingContext.budgets?.length || 0}
        - Upcoming Expenses: ${weddingContext.upcomingExpenses?.length || 0}
        - Expense Categories: ${Object.keys(weddingContext.expensesByCategory || {}).join(', ')}
      ` : 'No wedding data available yet.';
      
      prompt = `You are a helpful AI wedding planning assistant. A user is asking for advice about their wedding planning.

USER'S CURRENT WEDDING DATA:
${contextSummary}

USER'S QUESTION: "${sanitizedMessage}"

Please provide helpful, personalized advice based on their current wedding planning status. Be encouraging, practical, and specific. If they don't have much data yet, guide them on how to get started with wedding planning. Keep responses conversational and helpful.`;

      parts = [{ text: prompt }];
    } else if (type === 'analyzeBudget') {
      // Sanitize question input
      const sanitizedQuestion = question.substring(0, 300).replace(/[<>"']/g, '');
      const budgetSummary = budgetData ? JSON.stringify(budgetData, null, 2) : 'No budget data available';
      const expensesSummary = expenses ? expenses.slice(0, 20).map(exp => `${exp.title}: $${exp.amount} (${exp.category || 'Uncategorized'})${exp.is_paid ? ' - Paid' : ' - Unpaid'}`).join('\n') : 'No expenses data available';
      
      prompt = `You are a wedding budget analysis assistant. Analyze the user's budget data and answer their specific question.

BUDGET DATA:
${budgetSummary}

RECENT EXPENSES:
${expensesSummary}

USER'S QUESTION: "${sanitizedQuestion}"

Please provide detailed budget analysis and recommendations based on their specific question and current financial status. Be specific with numbers and actionable advice.`;

      parts = [{ text: prompt }];
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'

    let result
    if (type === 'analyzeImage') {
      try {
        // Try to parse JSON response
        result = JSON.parse(content)
      } catch {
        // If parsing fails, create a structured response from the text
        result = {
          style: 'AI-analyzed style',
          colors: ['#F8F9FA', '#212529', '#6C757D'],
          mood: 'Elegant and sophisticated',
          elements: ['AI-identified elements'],
          suggestions: [content.substring(0, 200) + '...']
        }
      }
    } else if (type === 'generateStory') {
      result = { story: content }
    } else if (type === 'weddingAssistant') {
      result = { response: content }
    } else if (type === 'analyzeBudget') {
      result = { analysis: content }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in gemini-analysis function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})