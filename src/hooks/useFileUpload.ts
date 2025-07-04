import { useState, useRef, DragEvent } from 'react';

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

        // Create a mock upload simulation
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
        setUploadProgress((i + 1) / files.length * 100);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
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