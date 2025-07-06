import { Upload, Trash2 } from 'lucide-react';
import { useFileUpload } from '../../../hooks/useFileUpload';

interface PhotosSectionProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
}

export default function PhotosSection({ websiteData, onUpdate }: PhotosSectionProps) {
  const updateContent = (section: string, updates: any) => {
    onUpdate({
      content: {
        ...websiteData.content,
        [section]: {
          ...websiteData.content[section],
          ...updates
        }
      }
    });
  };

  const { 
    isUploading, 
    uploadProgress, 
    dragActive, 
    handleDrag, 
    handleDrop, 
    triggerFileInput, 
    fileInputRef, 
    handleFileSelect 
  } = useFileUpload({
    onUploadComplete: (photos) => {
      const existingPhotos = websiteData.content.ourStory.photos || [];
      const newPhotoUrls = photos.map(photo => photo.url);
      updateContent('ourStory', { 
        photos: [...existingPhotos, ...newPhotoUrls] 
      });
    },
    onError: (error) => {
      console.error('Photo upload error:', error);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Photo Gallery</h3>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            {isUploading ? 'Uploading Photos...' : 'Upload Your Photos'}
          </h4>
          <p className="text-gray-500 mb-4">
            {dragActive 
              ? 'Drop photos here to upload' 
              : 'Add engagement photos, venue shots, and other memories'
            }
          </p>
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% complete</p>
            </div>
          ) : (
            <button 
              onClick={triggerFileInput}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Choose Photos
            </button>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-4">Our Story Photos</h4>
        <div className="grid grid-cols-3 gap-4">
          {websiteData.content.ourStory.photos && websiteData.content.ourStory.photos.length > 0 ? (
            websiteData.content.ourStory.photos.map((photo: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Story photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    const updated = websiteData.content.ourStory.photos.filter((_: string, i: number) => i !== index);
                    updateContent('ourStory', { photos: updated });
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No photos uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}