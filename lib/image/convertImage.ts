import { ConvertOptions, ProcessResult } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export async function convertSingleImage(
  file: File,
  options: ConvertOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const { canvas, ctx } = createCanvas(width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeTypeFromFormat(options.targetFormat);

  // If converting from transparent PNG/WebP to JPEG/BMP, fill clean white background
  if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));
  const blob = await canvasToBlob(canvas, targetMime, qualityDecimal);

  const originalSize = file.size;
  const outputSize = blob.size;
  const savedPercentage = Math.max(
    0,
    parseFloat((((originalSize - outputSize) / originalSize) * 100).toFixed(1))
  );

  const filename = generateOutputFilename(file.name, 'converted', options.targetFormat);
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    mimeType: targetMime,
    width,
    height,
    originalSize,
    outputSize,
    savedPercentage,
  };
}
