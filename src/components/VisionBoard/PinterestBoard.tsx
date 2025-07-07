import { useState } from 'react';
import { Upload, Plus, Heart, Search, Image as ImageIcon, Sparkles, Scissors } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useGemini } from '../../hooks/useGemini';
import PhotoUploadModal from './PhotoUploadModal';
import ImageAnalyzer from './ImageAnalyzer';
import BackgroundRemovalModal from './BackgroundRemovalModal';
import AddUrlImageModal from './AddUrlImageModal';
import UnsplashSearchModal from './UnsplashSearchModal';

interface Board {
  id: string;
  name: string;
  images: any[];
  category: string;
}

interface PinterestBoardProps {
  onNavigateBack: () => void;
}

export default function PinterestBoard({ onNavigateBack }: PinterestBoardProps) {
  
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', name: 'Wedding Dresses', images: [], category: 'Wedding Dress' },
    { id: '2', name: 'Venue Ideas', images: [], category: 'Venue' },
    { id: '3', name: 'Floral Arrangements', images: [], category: 'Flowers' },
    { id: '4', name: 'Color Palette', images: [], category: 'Colors' },
    { id: '5', name: 'Decorations', images: [], category: 'Decorations' }
  ]);
  
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'boards' | 'gallery'>('boards');
  const [newBoardName, setNewBoardName] = useState('');
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const [showUnsplashModal, setShowUnsplashModal] = useState(false);

  const { analyzeImage } = useGemini({
    onSuccess: (analysis) => {
      console.log('Image analysis complete:', analysis);
      setShowAnalyzer(false);
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      setShowAnalyzer(false);
    }
  });

  const handlePhotosUploaded = (photos: any[]) => {
    if (selectedBoard) {
      setBoards(prev => prev.map(board => 
        board.id === selectedBoard.id 
          ? { ...board, images: [...board.images, ...photos] }
          : board
      ));
    }
    setShowUploadModal(false);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const { triggerFileInput, fileInputRef, handleFileSelect } = useFileUpload({
    onUploadComplete: handlePhotosUploaded,
    onError: handleUploadError
  });

  const handleImageAnalysis = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowAnalyzer(true);
    analyzeImage(imageUrl);
  };

  const handleAnalysisComplete = (analysis: any) => {
    console.log('Analysis result:', analysis);
    setShowAnalyzer(false);
  };

  const addNewBoard = () => {
    if (newBoardName.trim()) {
      const newBoard: Board = {
        id: Date.now().toString(),
        name: newBoardName,
        images: [],
        category: 'Custom'
      };
      setBoards(prev => [...prev, newBoard]);
      setNewBoardName('');
      setShowNewBoardInput(false);
    }
  };

  const allImages = boards.flatMap(board => 
    board.images.map(img => ({ ...img, boardName: board.name, boardId: board.id }))
  );

  const filteredImages = allImages.filter(img => {
    const matchesSearch = img.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         img.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddUrlImage = (imageData: {
    url: string;
    thumbnail: string;
    filename: string;
    tags: string[];
  }) => {
    if (!selectedBoard) return;
    
    const newImage = {
      id: Date.now().toString(),
      url: imageData.url,
      thumbnail: imageData.thumbnail,
      filename: imageData.filename,
      size: 0,
      category: selectedBoard.category,
      tags: imageData.tags,
      isFavorite: false,
      uploadDate: new Date(),
      source: 'url' as const
    };
    
    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? { ...board, images: [...board.images, newImage] }
        : board
    ));
  };

  const handleAddUnsplashImages = (images: any[]) => {
    if (!selectedBoard) return;
    
    const newImages = images.map(img => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: img.url,
      thumbnail: img.thumbnail,
      filename: img.description || 'Unsplash image',
      size: 0,
      category: selectedBoard.category,
      tags: img.tags,
      isFavorite: false,
      uploadDate: new Date(),
      source: 'unsplash' as const,
      author: img.author,
      authorProfile: img.authorProfile
    }));
    
    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? { ...board, images: [...board.images, ...newImages] }
        : board
    ));
    setShowUnsplashModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateBack}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Vision Board
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Wedding Inspiration Boards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inspiration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
                <button
                  onClick={() => setShowUnsplashModal(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                  title="Search Unsplash"
                >
                  Unsplash
                </button>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('boards')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'boards' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Boards
                </button>
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'gallery' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'boards' ? (
          <>
            {/* Boards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedBoard(board)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-sage-100 relative">
                    {board.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1 h-full p-2">
                        {board.images.slice(0, 4).map((img, index) => (
                          <img
                            key={index}
                            src={img.thumbnail || img.url}
                            alt={img.filename}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full px-2 py-1 text-xs font-medium">
                      {board.images.length}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{board.name}</h3>
                    <p className="text-gray-500 text-sm">{board.category}</p>
                  </div>
                </div>
              ))}
              
              {/* Add New Board */}
              <div className="bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:border-primary-300 transition-colors">
                {showNewBoardInput ? (
                  <div className="p-6 h-full flex flex-col justify-center">
                    <input
                      type="text"
                      placeholder="Board name..."
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={addNewBoard}
                        className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setShowNewBoardInput(false);
                          setNewBoardName('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewBoardInput(true)}
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Plus className="h-12 w-12 mb-2" />
                    <span className="font-medium">Create New Board</span>
                  </button>
                )}
              </div>
            </div>

            {/* Selected Board Details */}
            {selectedBoard && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedBoard.name}</h2>
                    <p className="text-gray-500">{selectedBoard.images.length} images</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAddUrlModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add URL</span>
                    </button>
                    <button
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photos</span>
                    </button>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>Advanced Upload</span>
                    </button>
                  </div>
                </div>

                {/* Pinterest-style Grid */}
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                  {selectedBoard.images.map((image, index) => (
                    <div
                      key={index}
                      className="break-inside-avoid bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative"
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.filename}
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button
                          onClick={() => handleImageAnalysis(image.url)}
                          className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          title="AI Analysis"
                        >
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(image.url);
                            setShowBackgroundRemoval(true);
                          }}
                          className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          title="Remove Background"
                        >
                          <Scissors className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          title="Add to favorites"
                        >
                          <Heart className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-800 truncate">{image.filename}</p>
                        <p className="text-xs text-gray-500">{image.category}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBoard.images.length === 0 && (
                  <div className="text-center py-12">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                    <p className="text-gray-500 mb-6">Start building your {selectedBoard.name} board by uploading photos</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Gallery View */
          <div>
            <div className="mb-6 flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Wedding Dress">Wedding Dresses</option>
                <option value="Venue">Venues</option>
                <option value="Flowers">Flowers</option>
                <option value="Colors">Colors</option>
                <option value="Decorations">Decorations</option>
              </select>
              <span className="text-gray-500">{filteredImages.length} images</span>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-4 space-y-4">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="break-inside-avoid bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative"
                >
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.filename}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => handleImageAnalysis(image.url)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title="AI Analysis"
                    >
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </button>
                    <button
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title="Add to favorites"
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{image.filename}</p>
                    <p className="text-xs text-gray-500">{image.boardName} • {image.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <PhotoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onPhotosUploaded={handlePhotosUploaded}
        />
      )}

      {/* AI Analysis Modal */}
      {showAnalyzer && selectedImage && (
        <ImageAnalyzer
          imageUrl={selectedImage}
          onAnalysisComplete={handleAnalysisComplete}
          onClose={() => setShowAnalyzer(false)}
        />
      )}

      {/* Add URL Modal */}
      {showAddUrlModal && selectedBoard && (
        <AddUrlImageModal
          isOpen={showAddUrlModal}
          onClose={() => setShowAddUrlModal(false)}
          onAddImage={handleAddUrlImage}
          category={selectedBoard.name}
        />
      )}

      {/* Unsplash Search Modal */}
      {showUnsplashModal && (
        <UnsplashSearchModal
          isOpen={showUnsplashModal}
          onClose={() => setShowUnsplashModal(false)}
          onAddImages={handleAddUnsplashImages}
        />
      )}

      {/* Background Removal Modal */}
      {showBackgroundRemoval && selectedImage && (
        <BackgroundRemovalModal
          isOpen={showBackgroundRemoval}
          onClose={() => {
            setShowBackgroundRemoval(false);
            setSelectedImage('');
          }}
          imageUrl={selectedImage}
          onImageProcessed={(processedUrl) => {
            // Add the processed image to the current board
            if (selectedBoard) {
              const processedImage = {
                id: Date.now().toString(),
                url: processedUrl,
                thumbnail: processedUrl,
                filename: 'Background Removed Image',
                size: 0,
                category: selectedBoard.category,
                tags: ['background-removed'],
                isFavorite: false,
                uploadDate: new Date(),
                source: 'processed' as const
              };
              
              setBoards(prev => prev.map(board => 
                board.id === selectedBoard.id 
                  ? { ...board, images: [...board.images, processedImage] }
                  : board
              ));
            }
          }}
        />
      )}
    </div>
  );
}