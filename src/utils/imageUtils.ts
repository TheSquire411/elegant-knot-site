// Utility functions for image handling and validation

export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
};

export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Set a timeout to avoid hanging
    setTimeout(() => {
      reject(new Error('Image loading timeout'));
    }, 10000);
    
    img.src = url;
  });
};

export const validateImageUrl = async (url: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    // Basic URL validation
    new URL(url);
    
    // Check if it looks like an image URL
    if (!isValidImageUrl(url)) {
      return { valid: false, error: 'URL does not appear to be a direct image link' };
    }
    
    // Try to load the image
    await loadImageFromUrl(url);
    return { valid: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return { valid: false, error: 'Image loading timed out' };
      }
      if (error.message.includes('Failed to load')) {
        return { valid: false, error: 'Unable to load image. Check if URL is accessible and supports CORS.' };
      }
    }
    return { valid: false, error: 'Invalid URL format' };
  }
};

export const compressImage = (
  file: File, 
  maxWidth: number = 1920, 
  maxHeight: number = 1080, 
  quality: number = 0.8,
  outputFormat: string = 'image/jpeg'
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to compress image'));
        },
        outputFormat,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const generateMultipleSizes = async (file: File): Promise<{
  original: Blob;
  large: Blob;
  medium: Blob;
  thumbnail: Blob;
}> => {
  const [original, large, medium, thumbnail] = await Promise.all([
    compressImage(file, 1920, 1080, 0.9),
    compressImage(file, 1200, 800, 0.8),
    compressImage(file, 600, 400, 0.8),
    compressImage(file, 200, 200, 0.7)
  ]);
  
  return { original, large, medium, thumbnail };
};

export const generateThumbnail = (imageUrl: string, maxSize: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Calculate dimensions maintaining aspect ratio
      const { width, height } = img;
      const scale = Math.min(maxSize / width, maxSize / height);
      const newWidth = width * scale;
      const newHeight = height * scale;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => reject(new Error('Failed to create thumbnail'));
    img.src = imageUrl;
  });
};