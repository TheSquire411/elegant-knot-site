import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
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
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 5, 60000)) { // 5 requests per minute
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestBody = await req.json();
    const { aesthetic, venue, colors, season, mustHave, avoid }: VisionBoardRequest = requestBody;
    
    // Input validation
    if (!aesthetic || !venue || !colors || !season) {
      throw new Error('Missing required parameters: aesthetic, venue, colors, and season are required');
    }
    
    if (!Array.isArray(colors) || colors.length === 0) {
      throw new Error('Colors must be a non-empty array');
    }
    
    // Sanitize inputs
    const sanitizedAesthetic = aesthetic.substring(0, 50).replace(/[<>"']/g, '');
    const sanitizedVenue = venue.substring(0, 50).replace(/[<>"']/g, '');
    const sanitizedSeason = season.substring(0, 20).replace(/[<>"']/g, '');
    const sanitizedMustHave = mustHave?.substring(0, 100).replace(/[<>"']/g, '') || '';
    const sanitizedAvoid = avoid?.substring(0, 100).replace(/[<>"']/g, '') || '';
    
    const unsplashApiKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
    if (!unsplashApiKey) {
      throw new Error('Unsplash API key not configured');
    }

    console.log('Generating vision board for:', { aesthetic: sanitizedAesthetic, venue: sanitizedVenue, season: sanitizedSeason });

    // Create search queries based on preferences
    const venueQuery = sanitizedVenue.toLowerCase().replace('/', ' ');
    const aestheticQuery = sanitizedAesthetic.toLowerCase().replace('&', '').replace(' ', ' ');
    const seasonQuery = sanitizedSeason.toLowerCase();

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
        aesthetic: sanitizedAesthetic,
        venue: sanitizedVenue,
        colors,
        season: sanitizedSeason,
        mustHave: sanitizedMustHave,
        avoid: sanitizedAvoid
      },
      elements: {
        colorPalette: colors,
        venueImages: venueImages.map(img => img.urls.regular),
        moodImage: moodImages[0]?.urls.regular || venueImages[0]?.urls.regular,
        decorElements: decorImages.map(img => img.urls.small),
        keywords: [
          sanitizedAesthetic.split(' ')[0],
          sanitizedSeason.toLowerCase(),
          sanitizedVenue.split('/')[0].toLowerCase(),
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