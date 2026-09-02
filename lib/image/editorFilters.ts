import { EditorOptions, ProcessResult, WatermarkTextOptions, WatermarkImageOptions } from './types';
import { createCanvas, canvasToBlob, loadImage } from './canvasUtils';
import { getMimeTypeFromFormat, generateOutputFilename } from './fileValidation';

export function buildCssFilterString(options: EditorOptions): string {
  const parts: string[] = [];
  const { filter, adjustments } = options;

  // Basic adjustments
  if (adjustments.brightness !== 100) parts.push(`brightness(${adjustments.brightness}%)`);
  if (adjustments.contrast !== 100) parts.push(`contrast(${adjustments.contrast}%)`);
  if (adjustments.saturation !== 100) parts.push(`saturate(${adjustments.saturation}%)`);
  if (adjustments.hue !== 0) parts.push(`hue-rotate(${adjustments.hue}deg)`);
  if (adjustments.blur > 0) parts.push(`blur(${adjustments.blur}px)`);
  if (adjustments.opacity < 100) parts.push(`opacity(${adjustments.opacity}%)`);

  // Presets
  switch (filter) {
    case 'grayscale':
      parts.push('grayscale(100%)');
      break;
    case 'sepia':
      parts.push('sepia(100%)');
      break;
    case 'vintage':
      parts.push('sepia(50%) contrast(120%) brightness(90%)');
      break;
    case 'warm':
      parts.push('sepia(30%) saturate(140%)');
      break;
    case 'cool':
      parts.push('hue-rotate(180deg) saturate(110%)');
      break;
    case 'high-contrast':
      parts.push('contrast(160%) brightness(105%)');
      break;
    case 'black-white':
      parts.push('grayscale(100%) contrast(150%)');
      break;
    default:
      break;
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

function calculateWatermarkCoordinates(
  position: string,
  canvasW: number,
  canvasH: number,
  itemW: number,
  itemH: number,
  padding: number = 32
): { x: number; y: number } {
  switch (position) {
    case 'top-left':
      return { x: padding, y: padding };
    case 'top-center':
      return { x: (canvasW - itemW) / 2, y: padding };
    case 'top-right':
      return { x: canvasW - itemW - padding, y: padding };
    case 'center':
      return { x: (canvasW - itemW) / 2, y: (canvasH - itemH) / 2 };
    case 'bottom-left':
      return { x: padding, y: canvasH - itemH - padding };
    case 'bottom-center':
      return { x: (canvasW - itemW) / 2, y: canvasH - itemH - padding };
    case 'bottom-right':
    default:
      return { x: canvasW - itemW - padding, y: canvasH - itemH - padding };
  }
}

async function renderTextWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: WatermarkTextOptions
) {
  if (!opts.text.trim()) return;

  ctx.save();
  ctx.font = `bold ${opts.fontSize}px ${opts.fontFamily || 'sans-serif'}`;
  ctx.fillStyle = opts.color || '#ffffff';
  ctx.globalAlpha = Math.max(0, Math.min(1, opts.opacity / 100));

  const textMetrics = ctx.measureText(opts.text);
  const textWidth = textMetrics.width;
  const textHeight = opts.fontSize;

  const { x, y } = calculateWatermarkCoordinates(
    opts.position,
    width,
    height,
    textWidth,
    textHeight
  );

  ctx.translate(x + textWidth / 2, y + textHeight / 2);
  if (opts.rotation) {
    ctx.rotate((opts.rotation * Math.PI) / 180);
  }

  // Draw subtle shadow for readability
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillText(opts.text, -textWidth / 2, textHeight / 4);
  ctx.restore();
}

async function renderImageWatermark(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  opts: WatermarkImageOptions
) {
  const source = opts.imageFile || opts.imageBlobUrl;
  if (!source) return;

  try {
    const wmImg = await loadImage(source);
    const scale = Math.max(5, Math.min(100, opts.scale)) / 100;
    const baseWidth = canvasW * 0.25 * scale;
    const ratio = baseWidth / (wmImg.naturalWidth || wmImg.width);
    const targetW = baseWidth;
    const targetH = (wmImg.naturalHeight || wmImg.height) * ratio;

    const { x, y } = calculateWatermarkCoordinates(
      opts.position,
      canvasW,
      canvasH,
      targetW,
      targetH
    );

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opts.opacity / 100));
    ctx.drawImage(wmImg, x, y, targetW, targetH);
    ctx.restore();
  } catch (err) {
    console.error('Failed to render image watermark:', err);
  }
}

export async function processEditedImage(
  file: File,
  options: EditorOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const { canvas, ctx } = createCanvas(width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const targetMime = getMimeTypeFromFormat(options.format);
  if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  // Apply CSS filters directly to canvas context
  const filterString = buildCssFilterString(options);
  ctx.filter = filterString;
  ctx.drawImage(img, 0, 0, width, height);

  // Reset filter for subsequent overlays
  ctx.filter = 'none';

  // Apply Text Watermark if provided
  if (options.textWatermark?.text) {
    await renderTextWatermark(ctx, width, height, options.textWatermark);
  }

  // Apply Image/Logo Watermark if provided
  if (options.imageWatermark?.imageFile || options.imageWatermark?.imageBlobUrl) {
    await renderImageWatermark(ctx, width, height, options.imageWatermark);
  }

  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));
  const blob = await canvasToBlob(canvas, targetMime, qualityDecimal);

  const originalSize = file.size;
  const outputSize = blob.size;
  const savedPercentage = Math.max(
    0,
    parseFloat((((originalSize - outputSize) / originalSize) * 100).toFixed(1))
  );

  const filename = generateOutputFilename(file.name, 'edited', options.format);
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
