import { ImageFormat, SUPPORTED_FORMATS } from './types';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/avif',
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const isAcceptedType =
    ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    file.name.match(/\.(jpe?g|png|webp|gif|bmp|tiff?|avif)$/i);

  if (!isAcceptedType) {
    return {
      valid: false,
      error: `File format "${file.type || file.name}" is not supported. Please upload JPG, PNG, WebP, GIF, or BMP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 50MB.`,
    };
  }

  return { valid: true };
}

export function getMimeTypeFromFormat(format: ImageFormat): string {
  const found = SUPPORTED_FORMATS.find((f) => f.value === format);
  if (found) return found.mimeType;
  if (format === 'avif') return 'image/avif';
  return 'image/jpeg';
}

export function getExtensionFromFormat(format: ImageFormat): string {
  const found = SUPPORTED_FORMATS.find((f) => f.value === format);
  if (found) return found.extension;
  if (format === 'avif') return 'avif';
  return 'jpg';
}

export function generateOutputFilename(
  originalName: string,
  actionSuffix: string,
  targetFormat: ImageFormat
): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const baseName = lastDotIndex !== -1 ? originalName.slice(0, lastDotIndex) : originalName;
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const extension = getExtensionFromFormat(targetFormat);
  return `${safeBaseName}-${actionSuffix}.${extension}`;
}
