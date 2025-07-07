import { Download, Share2, Heart, Camera, Palette, Search, Upload, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { errorHandler } from '../../utils/errorHandling';
import UnsplashSearchModal from './UnsplashSearchModal';
import PhotoUploadModal from './PhotoUploadModal';

interface VisionBoardProps {
  board: {
    id: string;
    preferences: any;
    elements: {
      colorPalette: string[];
      venueImages: string[];
      moodImage: string;
      decorElements: string[];
      keywords: string[];
      userPhotos?: any[];
    };
  };
  hasExistingBoard?: boolean;
  onEditPreferences?: () => void;
}

export default function VisionBoardGenerator({ board, hasExistingBoard, onEditPreferences }: VisionBoardProps) {
  const { elements, preferences } = board;
  const [showUnsplashModal, setShowUnsplashModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [boardElements, setBoardElements] = useState(elements);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'success'>('idle');
  const { addNotification } = useApp();

  const handleDownload = async () => {
    setDownloadState('downloading');
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDownloadState('success');
      addNotification({
        type: 'success',
        title: 'Download Started',
        message: 'Your vision board is being prepared for download'
      });
      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (error) {
      setDownloadState('idle');
      errorHandler.handle(error, {
        context: 'Vision Board - Download',
        showToUser: true,
        severity: 'medium'
      });
    }
  };

  const handleShare = async () => {
    setShareState('sharing');
    try {
      // Simulate share process
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (navigator.share) {
        await navigator.share({
          title: 'My Wedding Vision Board',
          text: 'Check out my wedding vision board!',
          url: window.location.href,
        });
      } else {
        // Fallback to copying link
        await navigator.clipboard.writeText(window.location.href);
      }
      setShareState('success');
      addNotification({
        type: 'success',
        title: 'Vision Board Shared',
        message: 'Link copied to clipboard successfully'
      });
      setTimeout(() => setShareState('idle'), 2000);
    } catch (error) {
      setShareState('idle');
      errorHandler.handle(error, {
        context: 'Vision Board - Share',
        showToUser: true,
        severity: 'medium'
      });
    }
  };

  const handleAddUnsplashImages = (images: any[]) => {
    const newImages = images.map(img => ({
      id: img.id,
      url: img.url,
      thumbnail: img.thumbnail,
      filename: img.description || 'Unsplash image',
      size: 0,
      category: 'Inspiration',
      tags: img.tags,
      isFavorite: false,
      uploadDate: new Date(),
      source: 'unsplash' as const,
      author: img.author,
      authorProfile: img.authorProfile
    }));
    
    setBoardElements(prev => ({
      ...prev,
      userPhotos: [...(prev.userPhotos || []), ...newImages]
    }));
    setShowUnsplashModal(false);
  };

  const handleUploadPhotos = (photos: any[]) => {
    setBoardElements(prev => ({
      ...prev,
      userPhotos: [...(prev.userPhotos || []), ...photos]
    }));
    setShowUploadModal(false);
  };

  const userPhotoCount = boardElements.userPhotos?.length || 0;

  return (
    <div className="space-y-8">
      {/* Vision Board Canvas */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Your {preferences.aesthetic} Vision</h3>
              {userPhotoCount > 0 && (
                <p className="text-primary-100 text-sm flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  Featuring {userPhotoCount} of your personal photos
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {hasExistingBoard && onEditPreferences && (
                <button
                  onClick={onEditPreferences}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-sm"
                >
                  Edit Preferences
                </button>
              )}
              <button
                onClick={() => setShowUnsplashModal(true)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Search Unsplash"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Upload Photos"
              >
                <Upload className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleShare}
                disabled={shareState !== 'idle'}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={shareState === 'sharing' ? 'Creating share link...' : shareState === 'success' ? 'Shared!' : 'Share vision board'}
              >
                {shareState === 'sharing' ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : shareState === 'success' ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Share2 className="h-5 w-5 text-white" />
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloadState !== 'idle'}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={downloadState === 'downloading' ? 'Preparing download...' : downloadState === 'success' ? 'Downloaded!' : 'Download vision board'}
              >
                {downloadState === 'downloading' ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : downloadState === 'success' ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Download className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Main Vision Board Layout */}
          <div className="grid grid-cols-12 gap-6 h-96">
            {/* Central Mood Image */}
            <div className="col-span-5 relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={boardElements.moodImage}
                alt="Wedding mood"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-semibold">{preferences.aesthetic}</h4>
                <p className="text-sm opacity-90">{preferences.season} Wedding</p>
                {boardElements.userPhotos?.some(photo => photo.url === boardElements.moodImage) && (
                  <div className="flex items-center mt-1">
                    <Camera className="h-3 w-3 mr-1" />
                    <span className="text-xs">Your Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Color Palette */}
            <div className="col-span-3 space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 h-full">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-primary-500" />
                  Color Palette
                </h4>
                <div className="space-y-2">
                  {boardElements.colorPalette.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-600 font-medium">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Venue Inspiration */}
            <div className="col-span-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-800">Venue Inspiration</h4>
              <div className="grid grid-cols-2 gap-3 h-full">
                {boardElements.venueImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md relative">
                    <img
                      src={image}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {boardElements.userPhotos?.some(photo => photo.url === image) && (
                      <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                        <Camera className="h-3 w-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Design Elements Row */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            {/* Keywords */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Style Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {boardElements.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Decor Elements */}
            <div className="col-span-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Design Elements</h4>
              <div className="grid grid-cols-3 gap-4">
                {boardElements.decorElements.slice(0, 5).map((element, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-24 relative">
                    <img
                      src={element}
                      alt={`Decor ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {boardElements.userPhotos?.some(photo => photo.url === element) && (
                      <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                        <Camera className="h-2 w-2 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-gradient-to-br from-primary-100 to-sage-100 rounded-lg flex items-center justify-center h-24">
                  <Heart className="h-8 w-8 text-primary-500" />
                </div>
              </div>
            </div>
          </div>

          {/* User Photos Section */}
          {userPhotoCount > 0 && (
            <div className="mt-8 bg-gradient-to-r from-gold-50 to-primary-50 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                <Camera className="h-4 w-4 mr-2 text-gold-500" />
                Your Personal Photos ({userPhotoCount})
              </h4>
              <div className="grid grid-cols-6 gap-3">
                {boardElements.userPhotos?.slice(0, 6).map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-20 relative group">
                    <img
                      src={photo.thumbnail || photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    <div className="absolute bottom-1 left-1 bg-white/80 rounded px-1">
                      <span className="text-xs text-gray-600">{photo.source || photo.category}</span>
                    </div>
                    {photo.source === 'unsplash' && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                        U
                      </div>
                    )}
                  </div>
                ))}
                {userPhotoCount > 6 && (
                  <div className="rounded-lg bg-gray-100 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">+{userPhotoCount - 6} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Board Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vision Board Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Event Aesthetic</h4>
            <p className="text-gray-600">{preferences.aesthetic}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Venue Type</h4>
            <p className="text-gray-600">{preferences.venue}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Season</h4>
            <p className="text-gray-600">{preferences.season}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Color Theme</h4>
            <p className="text-gray-600">{preferences.colors?.join(' & ')}</p>
          </div>
          {userPhotoCount > 0 && (
            <>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Personal Photos</h4>
                <p className="text-gray-600">{userPhotoCount} photos integrated</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Photo Sources</h4>
                <p className="text-gray-600">
                  {[...new Set(boardElements.userPhotos?.map(photo => photo.source || photo.category))].join(', ')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <UnsplashSearchModal
        isOpen={showUnsplashModal}
        onClose={() => setShowUnsplashModal(false)}
        onAddImages={handleAddUnsplashImages}
      />
      
      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onPhotosUploaded={handleUploadPhotos}
        existingPhotos={boardElements.userPhotos || []}
      />
    </div>
  );
}