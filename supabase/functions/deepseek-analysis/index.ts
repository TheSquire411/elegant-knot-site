import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, imageUrl, style } = await req.json()
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')

    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured')
    }

    let prompt = ''
    if (type === 'analyzeImage') {
      prompt = `Analyze this wedding inspiration image and provide a detailed analysis in the following JSON format:
      {
        "style": "Brief style description",
        "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
        "mood": "Mood description",
        "elements": ["element1", "element2", "element3"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
      
      Focus on wedding planning aspects like style, color palette, mood, design elements, and practical suggestions for couples planning their wedding.
      
      Image URL: ${imageUrl}`
    } else if (type === 'generateStory') {
      prompt = `Create a beautiful, romantic wedding story based on the style: "${style}". 
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