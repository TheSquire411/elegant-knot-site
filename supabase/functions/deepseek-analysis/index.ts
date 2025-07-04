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
    const { type, imageUrl, style } = requestBody;
    
    // Input validation
    if (!type || (type !== 'analyzeImage' && type !== 'generateStory')) {
      throw new Error('Invalid request type');
    }
    
    if (type === 'analyzeImage' && !imageUrl) {
      throw new Error('Image URL is required for image analysis');
    }
    
    if (type === 'generateStory' && !style) {
      throw new Error('Style is required for story generation');
    }
    
    // Validate URL format for image analysis
    if (type === 'analyzeImage') {
      try {
        new URL(imageUrl);
      } catch {
        throw new Error('Invalid image URL format');
      }
    }

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')

    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured')
    }

    let prompt = ''
    if (type === 'analyzeImage') {
      // Sanitize imageUrl to prevent injection
      const sanitizedImageUrl = imageUrl.replace(/[<>"']/g, '');
      prompt = `Analyze this wedding inspiration image and provide a detailed analysis in the following JSON format:
      {
        "style": "Brief style description",
        "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
        "mood": "Mood description",
        "elements": ["element1", "element2", "element3"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
      
      Focus on wedding planning aspects like style, color palette, mood, design elements, and practical suggestions for couples planning their wedding.
      
      Image URL: ${sanitizedImageUrl}`
    } else if (type === 'generateStory') {
      // Sanitize style input and limit length
      const sanitizedStyle = style.substring(0, 100).replace(/[<>"']/g, '');
      prompt = `Create a beautiful, romantic wedding story based on the style: "${sanitizedStyle}". 
      The story should be 2-3 paragraphs long and capture the essence of this wedding style, 
      including details about the venue, decorations, atmosphere, and the couple's experience.
      Make it inspiring and emotional for couples planning their wedding.`
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    })

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

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
    } else {
      result = { story: content }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in deepseek-analysis function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})