'use client';

import React, { useState } from 'react';
import { RotateOptions, ImageFormat, SUPPORTED_FORMATS } from '@/lib/image/types';
import { rotateSingleImage } from '@/lib/image/rotateImage';
import { useBatchProcessor } from '@/hooks/useBatchProcessor';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { ImageList } from '@/components/image/ImageList';
import { ImagePreview } from '@/components/image/ImagePreview';
import { BatchProgressBar } from '@/components/image/BatchProgressBar';
import { Button } from '@/components/ui/button';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Play,
  Archive,
  Sliders,
  RefreshCw,
} from 'lucide-react';

export function RotateTool() {
  const [angle, setAngle] = useState<number>(90);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [format, setFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState<number>(90);

  const {
    files,
    selectedFile,
    selectedFileId,
    setSelectedFileId,
    addFiles,
    removeFile,
    clearAllFiles,
    processAll,
    downloadAllAsZip,
    isProcessing,
    isZipping,
    progress,
  } = useBatchProcessor<RotateOptions>(rotateSingleImage);

  const handleRotateBy = (delta: number) => {
    setAngle((prev) => ((prev + delta) % 360 + 360) % 360);
  };

  const handleReset = () => {
    setAngle(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  const handleRunRotate = () => {
    processAll({
      angle,
      flipHorizontal,
      flipVertical,
      format,
      quality,
    });
  };

  const hasDoneFiles = files.some((f) => f.status === 'done');

  return (
    <ToolLayout
      title="Rotate & Flip Image"
      description="Rotate images 90°, 180°, 270° or flip horizontally and vertically in batch directly in your browser."
      toolSlug="image-rotate"
      icon={RotateCw}
      badge="Quick Transform"
    >
      <div className="space-y-8">
        <ImageUploader onFilesSelected={addFiles} multiple={true} />

        {files.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Col: Controls */}
            <div className="lg:col-span-1 space-y-6">
              <ImageList
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onRemoveFile={removeFile}
                onClearAll={clearAllFiles}
              />

              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Transform Controls</h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-muted-foreground gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>

                {/* Quick Rotation Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Rotate
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleRotateBy(-90)}
                      className="gap-1.5 text-xs h-9"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-primary" />
                      -90° Left
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleRotateBy(90)}
                      className="gap-1.5 text-xs h-9"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-primary" />
                      +90° Right
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setAngle(180)}
                      className="gap-1.5 text-xs h-9"
                    >
                      180° Flip
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setAngle(270)}
                      className="gap-1.5 text-xs h-9"
                    >
                      270° Angle
                    </Button>
                  </div>
                </div>

                {/* Flip Buttons */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Flip Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={flipHorizontal ? 'default' : 'outline'}
                      type="button"
                      onClick={() => setFlipHorizontal(!flipHorizontal)}
                      className="gap-1.5 text-xs h-9"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      Horizontal
                    </Button>
                    <Button
                      variant={flipVertical ? 'default' : 'outline'}
                      type="button"
                      onClick={() => setFlipVertical(!flipVertical)}
                      className="gap-1.5 text-xs h-9"
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      Vertical
                    </Button>
                  </div>
                </div>

                {/* Custom Angle Slider */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">Custom Angle</span>
                    <span className="font-bold text-primary">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Target Format */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Output Format
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

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleRunRotate}
                    disabled={isProcessing || files.length === 0}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isProcessing
                      ? 'Transforming...'
                      : `Apply to ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`}
                  </Button>

                  {hasDoneFiles && (
                    <Button
                      variant="outline"
                      onClick={() => downloadAllAsZip('rotated_images.zip')}
                      disabled={isZipping}
                      className="w-full gap-2 h-10 text-xs font-semibold hover:bg-secondary"
                    >
                      <Archive className="w-4 h-4 text-primary" />
                      {isZipping ? 'Generating ZIP...' : 'Download All as ZIP'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Preview */}
            <div className="lg:col-span-2 space-y-6">
              <BatchProgressBar progress={progress} />

              {selectedFile ? (
                <ImagePreview imageFile={selectedFile} />
              ) : (
                <div className="bg-card rounded-2xl p-12 border border-border/60 text-center text-muted-foreground">
                  Select an image to preview results
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
