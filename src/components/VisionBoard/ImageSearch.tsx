import React, { useState, useCallback } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { errorHandler } from '../../utils/errorHandling';

interface ImageSearchProps {
  onAddImage: (imageUrl: string) => void;
}

interface UnsplashImage {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  author: string;
  authorProfile: string;
  downloadUrl: string;
  tags: string[];
  color: string;
  width: number;
  height: number;
}

const ImageSearch = ({ onAddImage }: ImageSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('search-unsplash', {
        body: {
          query: query.trim(),
          page: 1,
          per_page: 12
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setResults(data.results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search images';
      setError(errorMessage);
      errorHandler.handle(err, {
        context: 'Image Search',
        showToUser: true,
        severity: 'medium'
      });
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddImage = (image: UnsplashImage) => {
    onAddImage(image.url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for wedding inspiration images..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </div>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {results.map((image) => (
            <div key={image.id} className="relative group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
                <img
                  src={image.thumbnail}
                  alt={image.description || 'Search result'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => handleAddImage(image)}
                  className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-primary/90"
                  title="Add to vision board"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <div className="absolute bottom-2 left-2 bg-background/90 text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !isLoading && query && !error && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No images found for "{query}"</p>
          <p className="text-sm">Try different search terms</p>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;