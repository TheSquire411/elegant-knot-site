import React, { useState } from 'react';
import { X, Search, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface UnsplashSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImages: (images: UnsplashImage[]) => void;
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

export default function UnsplashSearchModal({ isOpen, onClose, onAddImages }: UnsplashSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const popularSearches = [
    'wedding venue',
    'wedding flowers',
    'wedding decoration',
    'bridal bouquet',
    'wedding cake',
    'wedding rings',
    'romantic lighting',
    'garden wedding',
    'beach wedding',
    'rustic wedding'
  ];

  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-unsplash', {
        body: { query, page, per_page: 20 }
      });

      if (error) throw error;

      if (page === 1) {
        setSearchResults(data.results);
      } else {
        setSearchResults(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.total_pages);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      alert('Failed to search images. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(searchQuery, 1);
  };

  const loadMoreResults = () => {
    if (currentPage < totalPages && !isSearching) {
      handleSearch(searchQuery, currentPage + 1);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleAddSelected = () => {
    const selectedImageObjects = searchResults.filter(img => selectedImages.has(img.id));
    onAddImages(selectedImageObjects);
    setSelectedImages(new Set());
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    handleSearch(query, 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Search Unsplash</h3>
            <p className="text-primary-100 text-sm">Find beautiful wedding inspiration photos</p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedImages.size > 0 && (
              <button
                onClick={handleAddSelected}
                className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-white font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedImages.size} Images
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for wedding inspiration..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </form>

          {/* Popular Searches */}
          {!hasSearched && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleQuickSearch(search)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching && searchResults.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
                <p className="text-gray-600">Searching for images...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {searchResults.map((image) => (
                  <div key={image.id} className="relative group cursor-pointer">
                    <div
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImages.has(image.id)
                          ? 'border-primary-500 shadow-lg'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => toggleImageSelection(image.id)}
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.description}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      
                      {/* Selection Indicator */}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 transition-all ${
                        selectedImages.has(image.id)
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white/80 border-white'
                      }`}>
                        {selectedImages.has(image.id) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Author Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs">
                          by{' '}
                          <a
                            href={image.authorProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {image.author}
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {image.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More */}
              {currentPage < totalPages && (
                <div className="text-center">
                  <button
                    onClick={loadMoreResults}
                    disabled={isSearching}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                        Loading...
                      </>
                    ) : (
                      'Load More Images'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No images found</p>
              <p className="text-gray-500">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Search for wedding inspiration</p>
              <p className="text-gray-500">Enter a search term or click on popular searches above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}