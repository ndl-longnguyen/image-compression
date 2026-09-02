import { ResizeOptions, ProcessResult } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export const RESIZE_PRESETS = [
  { label: 'Full HD (1920 × 1080)', width: 1920, height: 1080, ratio: '16:9' },
  { label: 'HD (1280 × 720)', width: 1280, height: 720, ratio: '16:9' },
  { label: 'Instagram Square (1080 × 1080)', width: 1080, height: 1080, ratio: '1:1' },
  { label: 'Facebook / OG Share (1200 × 630)', width: 1200, height: 630, ratio: '1.91:1' },
  { label: 'Standard Web (800 × 600)', width: 800, height: 600, ratio: '4:3' },
  { label: 'Story / Reel (1080 × 1920)', width: 1080, height: 1920, ratio: '9:16' },
];

export async function resizeSingleImage(
  file: File,
  options: ResizeOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.unit === 'percent') {
    const percent = Math.max(1, options.width) / 100;
    targetWidth = Math.round(origW * percent);
    targetHeight = Math.round(origH * percent);
  } else if (options.maintainAspectRatio) {
    if (targetWidth && !targetHeight) {
      targetHeight = Math.round((targetWidth / origW) * origH);
    } else if (targetHeight && !targetWidth) {
      targetWidth = Math.round((targetHeight / origH) * origW);
    }
  }

  targetWidth = Math.max(1, Math.round(targetWidth || origW));
  targetHeight = Math.max(1, Math.round(targetHeight || origH));

  const { canvas, ctx } = createCanvas(targetWidth, targetHeight);

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeTypeFromFormat(options.format);
  if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));
  const blob = await canvasToBlob(canvas, targetMime, qualityDecimal);

  const originalSize = file.size;
  const outputSize = blob.size;
  const savedPercentage = Math.max(
    0,
    parseFloat((((originalSize - outputSize) / originalSize) * 100).toFixed(1))
  );

  const filename = generateOutputFilename(
    file.name,
    `resized_${targetWidth}x${targetHeight}`,
    options.format
  );
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    mimeType: targetMime,
    width: targetWidth,
    height: targetHeight,
    originalSize,
    outputSize,
    savedPercentage,
  };
}
