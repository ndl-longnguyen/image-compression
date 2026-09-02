import { CompressOptions, ProcessResult } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export async function compressSingleImage(
  file: File,
  options: CompressOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  if (options.maxWidth || options.maxHeight) {
    const maxWidth = options.maxWidth || targetWidth;
    const maxHeight = options.maxHeight || targetHeight;

    if (options.maintainAspectRatio !== false) {
      const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight, 1);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    } else {
      if (options.maxWidth) targetWidth = options.maxWidth;
      if (options.maxHeight) targetHeight = options.maxHeight;
    }
  }

  const { canvas, ctx } = createCanvas(targetWidth, targetHeight);

  // If exporting to JPEG or BMP, ensure transparent pixels don't turn black
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

  const filename = generateOutputFilename(file.name, 'compressed', options.format);
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
