'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CropOptions, ImageFormat, ImageFile, ProcessResult, SUPPORTED_FORMATS } from '@/lib/image/types';
import { cropSingleImage } from '@/lib/image/cropImage';
import { downloadBlob, formatFileSize, revokeBlobUrl } from '@/lib/image/canvasUtils';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { Button } from '@/components/ui/button';
import {
  Crop,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Sparkles,
  Check,
  Ratio,
} from 'lucide-react';

const ASPECT_RATIOS = [
  { label: 'Free', value: 'free', ratio: 0 },
  { label: '1:1 Square', value: '1:1', ratio: 1 },
  { label: '4:3 Standard', value: '4:3', ratio: 4 / 3 },
  { label: '3:2 Classic', value: '3:2', ratio: 3 / 2 },
  { label: '16:9 Cinema', value: '16:9', ratio: 16 / 9 },
  { label: '9:16 Story', value: '9:16', ratio: 9 / 16 },
];

export function CropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  const [aspectRatio, setAspectRatio] = useState<string>('free');
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 10,
    y: 10,
    w: 80,
    h: 80,
  }); // percentage based (0-100)

  const [format, setFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; rect: typeof cropRect }>({
    x: 0,
    y: 0,
    rect: cropRect,
  });

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (previewUrl) revokeBlobUrl(previewUrl);
    if (result?.downloadUrl) revokeBlobUrl(result.downloadUrl);

    const url = URL.createObjectURL(selected);
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth || img.width);
      setNaturalHeight(img.naturalHeight || img.height);
      setFile(selected);
      setPreviewUrl(url);
      setResult(null);
      // Initialize centered 80% crop
      setCropRect({ x: 10, y: 10, w: 80, h: 80 });
    };
    img.src = url;
  };

  const applyAspectRatio = useCallback(
    (ratioValue: string) => {
      setAspectRatio(ratioValue);
      if (ratioValue === 'free' || naturalWidth === 0 || naturalHeight === 0) return;

      const target = ASPECT_RATIOS.find((r) => r.value === ratioValue);
      if (!target || target.ratio === 0) return;

      const imgAspect = naturalWidth / naturalHeight;
      const targetAspect = target.ratio;

      let w = 80;
      let h = 80;

      if (targetAspect > imgAspect) {
        // Target is wider than image
        w = 80;
        h = (80 * imgAspect) / targetAspect;
      } else {
        // Target is taller than image
        h = 80;
        w = (80 * targetAspect) / imgAspect;
      }

      setCropRect({
        x: Math.max(0, (100 - w) / 2),
        y: Math.max(0, (100 - h) / 2),
        w: Math.min(100, w),
        h: Math.min(100, h),
      });
    },
    [naturalWidth, naturalHeight]
  );

  // Mouse / Touch Dragging for Crop Box
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rect: { ...cropRect },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStartRef.current.x) / bounds.width) * 100;
    const deltaYPercent = ((e.clientY - dragStartRef.current.y) / bounds.height) * 100;

    const newX = Math.max(
      0,
      Math.min(
        100 - dragStartRef.current.rect.w,
        dragStartRef.current.rect.x + deltaXPercent
      )
    );
    const newY = Math.max(
      0,
      Math.min(
        100 - dragStartRef.current.rect.h,
        dragStartRef.current.rect.y + deltaYPercent
      )
    );

    setCropRect((prev) => ({
      ...prev,
      x: Math.round(newX),
      y: Math.round(newY),
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
  };

  const handleReset = () => {
    setCropRect({ x: 10, y: 10, w: 80, h: 80 });
    setAspectRatio('free');
  };

  const handleRunCrop = async () => {
    if (!file || naturalWidth === 0 || naturalHeight === 0) return;

    setIsProcessing(true);
    try {
      // Calculate pixel coordinates from percentage
      const pixelX = Math.round((cropRect.x / 100) * naturalWidth);
      const pixelY = Math.round((cropRect.y / 100) * naturalHeight);
      const pixelW = Math.round((cropRect.w / 100) * naturalWidth);
      const pixelH = Math.round((cropRect.h / 100) * naturalHeight);

      const options: CropOptions = {
        cropArea: { x: pixelX, y: pixelY, width: pixelW, height: pixelH },
        format,
        quality,
      };

      const res = await cropSingleImage(file, options);
      setResult(res);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image Cropper"
      description="Crop images with pixel perfection. Choose standard aspect ratios (1:1, 16:9, 4:3, 9:16) or freely position your crop boundary."
      toolSlug="image-cropper"
      icon={Crop}
      badge="Visual"
    >
      <div className="space-y-8">
        {!file && <ImageUploader onFilesSelected={handleFileSelected} multiple={false} />}

        {file && previewUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Col: Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Crop Controls</h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-muted-foreground gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>

                {/* Aspect Ratio Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => applyAspectRatio(r.value)}
                        className={`py-2 px-2 text-xs rounded-lg font-medium border text-center transition-colors ${
                          aspectRatio === r.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border-border/60'
                        }`}
                      >
                        {r.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop Box Dimensions Display */}
                <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Original Size:</span>
                    <span className="font-medium text-foreground">
                      {naturalWidth} × {naturalHeight} px
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cropped Output:</span>
                    <span className="font-bold text-primary">
                      {Math.round((cropRect.w / 100) * naturalWidth)} ×{' '}
                      {Math.round((cropRect.h / 100) * naturalHeight)} px
                    </span>
                  </div>
                </div>

                {/* Output Format */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Target Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ImageFormat)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SUPPORTED_FORMATS.slice(0, 3).map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleRunCrop}
                    disabled={isProcessing}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Crop className="w-4 h-4" />
                    {isProcessing ? 'Cropping...' : 'Crop Image'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                      setResult(null);
                    }}
                    className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Choose Another Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Canvas Cropper Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Drag the highlighted box to reposition crop region</span>
                  <span>
                    Crop Box: {cropRect.w}% × {cropRect.h}%
                  </span>
                </div>

                {/* Cropper Container */}
                <div
                  ref={containerRef}
                  className="relative max-h-[500px] overflow-hidden rounded-xl bg-black/40 border border-border flex items-center justify-center select-none"
                >
                  <img
                    src={previewUrl}
                    alt="To Crop"
                    className="max-h-[500px] max-w-full object-contain pointer-events-none"
                  />

                  {/* Darkened Overlay */}
                  <div className="absolute inset-0 bg-black/50 pointer-events-none" />

                  {/* Interactive Active Crop Box */}
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute border-2 border-primary bg-transparent cursor-move shadow-2xl ring-2 ring-primary/40"
                    style={{
                      left: `${cropRect.x}%`,
                      top: `${cropRect.y}%`,
                      width: `${cropRect.w}%`,
                      height: `${cropRect.h}%`,
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    {/* Grid Lines for Rule of Thirds */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                      <div className="border-r border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-b border-white/60" />
                      <div className="border-r border-white/60" />
                      <div className="border-r border-white/60" />
                      <div />
                    </div>

                    {/* Corner Handles */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Crop Result Preview Card */}
              {result && (
                <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h3 className="font-bold text-base text-foreground">Cropped Result</h3>
                    </div>
                    <Button
                      onClick={() => downloadBlob(result.blob, result.filename)}
                      className="gap-1.5 h-8 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Cropped
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-xl max-h-[360px] overflow-hidden">
                    <img
                      src={result.downloadUrl}
                      alt="Cropped Output"
                      className="max-h-[320px] max-w-full object-contain rounded-lg shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-secondary/50 text-center text-xs">
                    <div>
                      <span className="text-muted-foreground block">Dimensions</span>
                      <span className="font-bold text-foreground">
                        {result.width} × {result.height} px
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">File Size</span>
                      <span className="font-bold text-primary">
                        {formatFileSize(result.outputSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Format</span>
                      <span className="font-bold text-foreground uppercase">
                        {result.mimeType.split('/')[1]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
