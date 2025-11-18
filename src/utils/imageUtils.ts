// Image utility functions for Base64 handling

/**
 * Convert File to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Resize image and convert to Base64
 */
export const resizeImageToBase64 = (
  file: File, 
  maxWidth: number = 1200, 
  maxHeight: number = 800, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Get compressed base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file type and size
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, SVG)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Kích thước file không được vượt quá 10MB'
    };
  }

  return { isValid: true };
};

/**
 * Get image dimensions from Base64
 */
export const getBase64ImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Compress Base64 image
 */
export const compressBase64Image = (
  base64: string, 
  quality: number = 0.8,
  maxWidth: number = 1200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      const ratio = width / height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Check if string is valid Base64 image
 */
export const isValidBase64Image = (base64: string): boolean => {
  const regex = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/;
  return regex.test(base64);
};

/**
 * Get Base64 image size in bytes
 */
export const getBase64Size = (base64: string): number => {
  const base64Data = base64.split(',')[1];
  return Math.round((base64Data.length * 3) / 4);
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create thumbnail from Base64 image
 */
export const createThumbnail = (
  base64: string, 
  width: number = 300, 
  height: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;
      
      // Calculate crop dimensions to maintain aspect ratio
      const imgRatio = img.width / img.height;
      const thumbRatio = width / height;
      
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      
      if (imgRatio > thumbRatio) {
        // Image is wider than thumbnail
        sw = img.height * thumbRatio;
        sx = (img.width - sw) / 2;
      } else {
        // Image is taller than thumbnail
        sh = img.width / thumbRatio;
        sy = (img.height - sh) / 2;
      }
      
      ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };
    
    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Convert Base64 to Blob
 */
export const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};

/**
 * Download Base64 image as file
 */
export const downloadBase64Image = (base64: string, filename: string): void => {
  const blob = base64ToBlob(base64);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Create image gallery with thumbnails
 */
export const createImageGallery = async (files: File[]): Promise<{
  thumbnails: string[];
  fullImages: string[];
}> => {
  const thumbnails: string[] = [];
  const fullImages: string[] = [];
  
  for (const file of files) {
    try {
      // Create full size image (compressed)
      const fullImage = await resizeImageToBase64(file, 1920, 1080, 0.9);
      fullImages.push(fullImage);
      
      // Create thumbnail
      const thumbnail = await createThumbnail(fullImage, 300, 200);
      thumbnails.push(thumbnail);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }
  
  return { thumbnails, fullImages };
};