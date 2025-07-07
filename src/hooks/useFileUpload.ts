import { useState, useRef, DragEvent } from 'react';
import { generateMultipleSizes } from '../utils/imageUtils';

interface UseFileUploadProps {
  onUploadComplete: (photos: any[]) => void;
  onError: (error: string) => void;
}

export function useFileUpload({ onUploadComplete, onError }: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          continue;
        }

        try {
          // Generate optimized versions of the image
          const optimizedImages = await generateMultipleSizes(file);
          
          // Create URLs for each size
          const photoData = {
            id: Date.now().toString() + i,
            filename: file.name,
            url: URL.createObjectURL(optimizedImages.large),
            thumbnail: URL.createObjectURL(optimizedImages.thumbnail),
            mediumUrl: URL.createObjectURL(optimizedImages.medium),
            originalUrl: URL.createObjectURL(optimizedImages.original),
            size: file.size,
            optimizedSize: {
              original: optimizedImages.original.size,
              large: optimizedImages.large.size,
              medium: optimizedImages.medium.size,
              thumbnail: optimizedImages.thumbnail.size
            },
            uploadDate: new Date(),
            isFavorite: false
          };

          photos.push(photoData);
        } catch (imageError) {
          console.warn('Failed to optimize image, using original:', imageError);
          
          // Fallback to original file if optimization fails
          const photoData = {
            id: Date.now().toString() + i,
            filename: file.name,
            url: URL.createObjectURL(file),
            thumbnail: URL.createObjectURL(file),
            size: file.size,
            uploadDate: new Date(),
            isFavorite: false
          };
          
          photos.push(photoData);
        }
        
        setUploadProgress((i + 1) / files.length * 100);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      onUploadComplete(photos);
    } catch (error) {
      onError('Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    isUploading,
    uploadProgress,
    dragActive,
    handleDrag,
    handleDrop,
    triggerFileInput,
    fileInputRef,
    handleFileSelect
  };
}