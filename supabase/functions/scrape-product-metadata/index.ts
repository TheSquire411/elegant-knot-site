import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductMetadata {
  title: string;
  description?: string;
  price?: string;
  image_url?: string;
  store_name: string;
}

function extractStoreName(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  } catch {
    return 'Unknown Store';
  }
}

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractTitle(html: string): string {
  // Try Open Graph title first
  let title = extractMetaContent(html, 'og:title');
  
  // Fallback to regular title tag
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    title = titleMatch ? titleMatch[1] : null;
  }
  
  return title?.trim() || 'Untitled Product';
}

function extractPrice(html: string, storeName: string): string | null {
  // Common price selectors for major retailers
  const priceSelectors = [
    // Generic patterns
    /[\$£€¥][\d,]+\.?\d*/g,
    /price[^>]*>[\s]*[\$£€¥]?[\d,]+\.?\d*/gi,
    
    // Store-specific patterns
    ...(storeName.toLowerCase().includes('amazon') ? [
      /a-price-whole[^>]*>[\d,]+/gi,
      /a-offscreen[^>]*>[\$][\d,]+\.?\d*/gi
    ] : []),
    
    ...(storeName.toLowerCase().includes('target') ? [
      /\$[\d,]+\.?\d*(?=\s*<\/)/g
    ] : [])
  ];
  
  for (const selector of priceSelectors) {
    const matches = html.match(selector);
    if (matches && matches.length > 0) {
      // Return the first reasonable price found
      const price = matches[0].replace(/[^\d.,\$£€¥]/g, '');
      if (price && price.length > 1) {
        return price;
      }
    }
  }
  
  return null;
}

async function scrapeProductMetadata(url: string): Promise<ProductMetadata> {
  try {
    console.log(`Scraping metadata for: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const storeName = extractStoreName(url);
    
    // Extract metadata
    const title = extractTitle(html);
    const description = extractMetaContent(html, 'og:description') || 
                      extractMetaContent(html, 'description');
    const price = extractPrice(html, storeName);
    const image_url = extractMetaContent(html, 'og:image');
    
    console.log(`Scraped metadata: ${JSON.stringify({ title, price, storeName })}`);
    
    return {
      title,
      description: description?.substring(0, 500), // Limit description length
      price,
      image_url,
      store_name: storeName
    };
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    
    // Return basic metadata even if scraping fails
    return {
      title: 'Product',
      store_name: extractStoreName(url)
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const metadata = await scrapeProductMetadata(url);
    
    return new Response(
      JSON.stringify(metadata), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in scrape-product-metadata function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to scrape product metadata' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});