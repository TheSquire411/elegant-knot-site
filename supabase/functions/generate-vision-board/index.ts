import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VisionBoardRequest {
  aesthetic: string;
  venue: string;
  colors: string[];
  season: string;
  mustHave?: string;
  avoid?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { aesthetic, venue, colors, season, mustHave, avoid }: VisionBoardRequest = await req.json();
    
    const unsplashApiKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
    if (!unsplashApiKey) {
      throw new Error('Unsplash API key not configured');
    }

    console.log('Generating vision board for:', { aesthetic, venue, season });

    // Create search queries based on preferences
    const venueQuery = venue.toLowerCase().replace('/', ' ');
    const aestheticQuery = aesthetic.toLowerCase().replace('&', '').replace(' ', ' ');
    const seasonQuery = season.toLowerCase();

    // Fetch different types of images
    const [venueImages, decorImages, moodImages] = await Promise.all([
      fetchUnsplashImages(unsplashApiKey, `${venueQuery} wedding venue`, 6),
      fetchUnsplashImages(unsplashApiKey, `wedding ${aestheticQuery} decor flowers`, 8),
      fetchUnsplashImages(unsplashApiKey, `${seasonQuery} wedding ${aestheticQuery}`, 4)
    ]);

    // Create the vision board data
    const visionBoardData = {
      id: crypto.randomUUID(),
      preferences: {
        aesthetic,
        venue,
        colors,
        season,
        mustHave,
        avoid
      },
      elements: {
        colorPalette: colors,
        venueImages: venueImages.map(img => img.urls.regular),
        moodImage: moodImages[0]?.urls.regular || venueImages[0]?.urls.regular,
        decorElements: decorImages.map(img => img.urls.small),
        keywords: [
          aesthetic.split(' ')[0],
          season.toLowerCase(),
          venue.split('/')[0].toLowerCase(),
          'romantic',
          'elegant',
          'timeless'
        ],
        userPhotos: []
      }
    };

    console.log('Vision board generated successfully');

    return new Response(
      JSON.stringify(visionBoardData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating vision board:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function fetchUnsplashImages(apiKey: string, query: string, count: number) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Client-ID ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
}