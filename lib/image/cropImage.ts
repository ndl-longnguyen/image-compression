import { CropOptions, ProcessResult } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export async function cropSingleImage(
  file: File,
  options: CropOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Clamp crop coordinates within natural bounds
  const x = Math.max(0, Math.min(options.cropArea.x, origW - 1));
  const y = Math.max(0, Math.min(options.cropArea.y, origH - 1));
  const width = Math.max(1, Math.min(options.cropArea.width, origW - x));
  const height = Math.max(1, Math.min(options.cropArea.height, origH - y));

  const { canvas, ctx } = createCanvas(width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeTypeFromFormat(options.format);
  if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw only the cropped bounding box from source image
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));
  const blob = await canvasToBlob(canvas, targetMime, qualityDecimal);

  const originalSize = file.size;
  const outputSize = blob.size;
  const savedPercentage = Math.max(
    0,
    parseFloat((((originalSize - outputSize) / originalSize) * 100).toFixed(1))
  );

  const filename = generateOutputFilename(file.name, 'cropped', options.format);
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    mimeType: targetMime,
    width: Math.round(width),
    height: Math.round(height),
    originalSize,
    outputSize,
    savedPercentage,
  };
}
