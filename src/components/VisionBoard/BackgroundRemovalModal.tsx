import { useState } from 'react';
import { Scissors, Download, Sparkles, X, Upload, Wand2 } from 'lucide-react';
import { removeBackground, loadImage } from '../../utils/backgroundRemoval';

interface BackgroundRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  onImageProcessed: (processedImageUrl: string) => void;
}

export default function BackgroundRemovalModal({
  isOpen,
  onClose,
  imageUrl,
  onImageProcessed
}: BackgroundRemovalModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>(imageUrl || '');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage('');
    }
  };

  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      let imageElement: HTMLImageElement;
      
      if (selectedFile) {
        imageElement = await loadImage(selectedFile);
      } else {
        // Load from URL
        imageElement = new Image();
        imageElement.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
          imageElement.src = originalImage;
        });
      }

      const resultBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(processedUrl);
    } catch (error) {
      console.error('Failed to remove background:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      link.click();
    }
  };

  const useProcessedImage = () => {
    if (processedImage) {
      onImageProcessed(processedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Scissors className="h-6 w-6 mr-2" />
              AI Background Removal
            </h3>
            <p className="text-purple-100 text-sm">Remove backgrounds instantly with AI</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!originalImage ? (
            // Upload Section
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Upload an Image</h4>
              <p className="text-gray-600 mb-6">Select an image to remove its background</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="background-removal-upload"
              />
              <label
                htmlFor="background-removal-upload"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
              >
                Choose Image
              </label>
            </div>
          ) : (
            // Processing Section
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Original Image</h4>
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Background Removed
                    {isProcessing && (
                      <span className="ml-2 text-sm text-purple-600 flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 animate-pulse" />
                        Processing...
                      </span>
                    )}
                  </h4>
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center relative">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="Background removed"
                        className="max-w-full max-h-full object-contain"
                        style={{
                          background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                      />
                    ) : isProcessing ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                        <p className="text-gray-600">AI is removing the background...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Click "Remove Background" to start</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="change-image-upload"
                  />
                  <label
                    htmlFor="change-image-upload"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Change Image
                  </label>
                </div>

                <div className="flex space-x-3">
                  {!processedImage && !isProcessing && (
                    <button
                      onClick={processImage}
                      className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Scissors className="h-4 w-4" />
                      <span>Remove Background</span>
                    </button>
                  )}

                  {processedImage && (
                    <>
                      <button
                        onClick={downloadProcessedImage}
                        className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={useProcessedImage}
                        className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <span>Use This Image</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">Tips for best results:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use images with clear subjects and distinct backgrounds</li>
                  <li>• Higher resolution images typically produce better results</li>
                  <li>• Avoid images with complex or busy backgrounds</li>
                  <li>• The AI works best with people, products, and objects</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}