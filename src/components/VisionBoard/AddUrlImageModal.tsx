import { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { validateImageUrl, generateThumbnail } from '../../utils/imageUtils';

interface AddUrlImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (imageData: {
    url: string;
    thumbnail: string;
    filename: string;
    tags: string[];
  }) => void;
  category: string;
}

export default function AddUrlImageModal({ isOpen, onClose, onAddImage, category }: AddUrlImageModalProps) {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [tags, setTags] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setValidationResult(null);
    setPreviewUrl('');
    
    if (!newUrl.trim()) return;
    
    setIsValidating(true);
    
    try {
      const result = await validateImageUrl(newUrl);
      setValidationResult(result);
      
      if (result.valid) {
        setPreviewUrl(newUrl);
        // Auto-generate filename if not provided
        if (!filename) {
          const urlPath = new URL(newUrl).pathname;
          const name = urlPath.split('/').pop() || 'Image from URL';
          setFilename(name);
        }
      }
    } catch (error) {
      setValidationResult({ valid: false, error: 'Failed to validate URL' });
    }
    
    setIsValidating(false);
  };

  const handleSubmit = async () => {
    if (!validationResult?.valid || !url) return;
    
    try {
      const thumbnail = await generateThumbnail(url);
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      onAddImage({
        url,
        thumbnail,
        filename: filename || 'Image from URL',
        tags: tagArray
      });
      
      // Reset form
      setUrl('');
      setFilename('');
      setTags('');
      setValidationResult(null);
      setPreviewUrl('');
      onClose();
    } catch (error) {
      console.error('Failed to process image:', error);
      setValidationResult({ valid: false, error: 'Failed to process image' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Add Image from URL</h3>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Validation Status */}
            {validationResult && (
              <div className={`mt-2 flex items-center space-x-2 text-sm ${
                validationResult.valid ? 'text-green-600' : 'text-red-600'
              }`}>
                {validationResult.valid ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>
                  {validationResult.valid ? 'Valid image URL' : validationResult.error}
                </span>
              </div>
            )}
          </div>

          {/* Preview */}
          {previewUrl && validationResult?.valid && (
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={() => setValidationResult({ valid: false, error: 'Failed to load image preview' })}
              />
            </div>
          )}

          {/* Filename Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter a name for this image"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="wedding, flowers, decoration"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              This image will be added to your <span className="font-medium">{category}</span> board.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!validationResult?.valid || isValidating}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Add Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}