export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'avif';

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width: number;
  height: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress?: number;
  error?: string;
  result?: ProcessResult;
}

export interface ProcessResult {
  blob: Blob;
  downloadUrl: string;
  filename: string;
  mimeType: string;
  width: number;
  height: number;
  originalSize: number;
  outputSize: number;
  savedPercentage: number;
}

export interface FormatOption {
  value: ImageFormat;
  label: string;
  mimeType: string;
  extension: string;
}

export const SUPPORTED_FORMATS: FormatOption[] = [
  { value: 'webp', label: 'WebP (Recommended)', mimeType: 'image/webp', extension: 'webp' },
  { value: 'jpeg', label: 'JPEG / JPG', mimeType: 'image/jpeg', extension: 'jpg' },
  { value: 'png', label: 'PNG', mimeType: 'image/png', extension: 'png' },
  { value: 'gif', label: 'GIF (Static)', mimeType: 'image/gif', extension: 'gif' },
  { value: 'bmp', label: 'BMP', mimeType: 'image/bmp', extension: 'bmp' },
];

export interface CompressOptions {
  quality: number; // 1 - 100
  format: ImageFormat;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  unit: 'pixels' | 'percent';
  format: ImageFormat;
  quality: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  cropArea: CropArea;
  format: ImageFormat;
  quality: number;
}

export interface RotateOptions {
  angle: 0 | 90 | 180 | 270 | number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  format: ImageFormat;
  quality: number;
}

export interface ConvertOptions {
  targetFormat: ImageFormat;
  quality: number;
}

export type FilterType =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'vintage'
  | 'warm'
  | 'cool'
  | 'high-contrast'
  | 'black-white';

export interface EditorAdjustments {
  brightness: number; // 0 - 200, default 100
  contrast: number;   // 0 - 200, default 100
  saturation: number; // 0 - 200, default 100
  exposure: number;   // -100 - 100, default 0
  hue: number;        // 0 - 360, default 0
  blur: number;       // 0 - 20, default 0
  sharpen: number;    // 0 - 100, default 0
  opacity: number;    // 0 - 100, default 100
}

export interface WatermarkTextOptions {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  position: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  rotation: number;
}

export interface WatermarkImageOptions {
  imageFile?: File;
  imageBlobUrl?: string;
  scale: number; // 10 - 100
  opacity: number; // 0 - 100
  position: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface EditorOptions {
  filter: FilterType;
  adjustments: EditorAdjustments;
  textWatermark?: WatermarkTextOptions;
  imageWatermark?: WatermarkImageOptions;
  format: ImageFormat;
  quality: number;
}

export interface BatchProgress {
  total: number;
  completed: number;
  inProgress: number;
  failed: number;
  isProcessing: boolean;
}
