import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string;
  page?: number;
  per_page?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, page = 1, per_page = 20 }: SearchRequest = await req.json();
    
    const unsplashApiKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
    if (!unsplashApiKey) {
      throw new Error('Unsplash API key not configured');
    }

    console.log('Searching Unsplash for:', query);

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${unsplashApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data to match our photo format
    const transformedResults = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      description: photo.description || photo.alt_description || 'Unsplash photo',
      author: photo.user.name,
      authorProfile: photo.user.links.html,
      downloadUrl: photo.links.download_location,
      tags: photo.tags?.map((tag: any) => tag.title) || [],
      color: photo.color,
      width: photo.width,
      height: photo.height
    }));

    console.log(`Found ${transformedResults.length} images for "${query}"`);

    return new Response(
      JSON.stringify({
        results: transformedResults,
        total: data.total,
        total_pages: data.total_pages,
        page: page
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error searching Unsplash:', error);
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