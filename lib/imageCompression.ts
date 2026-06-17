export interface CompressionOptions {
  quality: number; // 0-100
  format: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | string;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export interface CompressionResult {
  data: Blob;
  mimeType: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

const PRESET_LEVELS = {
  low: { quality: 95, label: 'Low' },
  medium: { quality: 80, label: 'Medium' },
  high: { quality: 60, label: 'High' },
};

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          // Create canvas
          let width = img.width;
          let height = img.height;

          // Handle resizing
          if (options.width || options.height) {
            if (options.maintainAspectRatio) {
              if (options.width && !options.height) {
                const ratio = options.width / width;
                height = height * ratio;
                width = options.width;
              } else if (options.height && !options.width) {
                const ratio = options.height / height;
                width = width * ratio;
                height = options.height;
              } else if (options.width && options.height) {
                width = options.width;
                height = options.height;
              }
            } else {
              width = options.width || width;
              height = options.height || height;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Fill background for PNG/WebP to JPEG conversion
          if (
            (options.format === 'jpeg' || options.format === 'jpg') &&
            (file.type === 'image/png' || file.type === 'image/webp')
          ) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Determine MIME type
          let mimeType = 'image/jpeg';
          if (options.format === 'png') {
            mimeType = 'image/png';
          } else if (options.format === 'webp') {
            mimeType = 'image/webp';
          } else if (options.format === 'gif') {
            mimeType = 'image/gif';
          } else if (options.format === 'bmp') {
            mimeType = 'image/bmp';
          } else if (options.format === 'tiff') {
            mimeType = 'image/tiff';
          }

          // Convert to blob with compression quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error('Could not convert canvas to blob');
              }

              const compressionRatio = (
                ((file.size - blob.size) / file.size) *
                100
              ).toFixed(2);

              resolve({
                data: blob,
                mimeType,
                width,
                height,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: parseFloat(compressionRatio),
              });
            },
            mimeType,
            options.quality / 100
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function getPresetLevel(level: 'low' | 'medium' | 'high') {
  return PRESET_LEVELS[level];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const SUPPORTED_FORMATS = [
  { value: 'jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'png', label: 'PNG', extension: 'png' },
  { value: 'webp', label: 'WebP', extension: 'webp' },
  { value: 'gif', label: 'GIF', extension: 'gif' },
  { value: 'bmp', label: 'BMP', extension: 'bmp' },
  { value: 'tiff', label: 'TIFF', extension: 'tiff' },
];
