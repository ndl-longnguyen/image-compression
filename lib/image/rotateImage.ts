import { RotateOptions, ProcessResult } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export async function rotateSingleImage(
  file: File,
  options: RotateOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Normalize angle in degrees
  const angle = ((options.angle % 360) + 360) % 360;
  const radians = (angle * Math.PI) / 180;

  // Calculate new canvas dimensions when rotated
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = Math.round(origW * cos + origH * sin);
  const newHeight = Math.round(origW * sin + origH * cos);

  const { canvas, ctx } = createCanvas(newWidth, newHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeTypeFromFormat(options.format);
  if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newWidth, newHeight);
  }

  // Move origin to center of rotated canvas
  ctx.translate(newWidth / 2, newHeight / 2);

  // Apply rotation
  ctx.rotate(radians);

  // Apply horizontal/vertical flips
  const scaleX = options.flipHorizontal ? -1 : 1;
  const scaleY = options.flipVertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Draw image centered at origin
  ctx.drawImage(img, -origW / 2, -origH / 2, origW, origH);

  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));
  const blob = await canvasToBlob(canvas, targetMime, qualityDecimal);

  const originalSize = file.size;
  const outputSize = blob.size;
  const savedPercentage = Math.max(
    0,
    parseFloat((((originalSize - outputSize) / originalSize) * 100).toFixed(1))
  );

  const filename = generateOutputFilename(file.name, `rotated_${angle}deg`, options.format);
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    mimeType: targetMime,
    width: newWidth,
    height: newHeight,
    originalSize,
    outputSize,
    savedPercentage,
  };
}
