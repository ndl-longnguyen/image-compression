'use client';

import React, { useState, useEffect } from 'react';
import { ResizeOptions, ImageFormat, SUPPORTED_FORMATS } from '@/lib/image/types';
import { resizeSingleImage, RESIZE_PRESETS } from '@/lib/image/resizeImage';
import { useBatchProcessor } from '@/hooks/useBatchProcessor';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { ImageList } from '@/components/image/ImageList';
import { ImagePreview } from '@/components/image/ImagePreview';
import { BatchProgressBar } from '@/components/image/BatchProgressBar';
import { Button } from '@/components/ui/button';
import { Maximize2, Lock, Unlock, Percent, Play, Archive, Sliders } from 'lucide-react';

export function ResizerTool() {
  const [unit, setUnit] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [percentValue, setPercentValue] = useState<number>(50);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [format, setFormat] = useState<ImageFormat>('webp');

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
  } = useBatchProcessor<ResizeOptions>(resizeSingleImage);

  // Sync initial dimensions with selected file if available
  useEffect(() => {
    if (selectedFile && selectedFile.width > 0) {
      setWidth(selectedFile.width);
      setHeight(selectedFile.height);
    }
  }, [selectedFileId, selectedFile?.width]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && selectedFile && selectedFile.width > 0) {
      const ratio = selectedFile.height / selectedFile.width;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && selectedFile && selectedFile.height > 0) {
      const ratio = selectedFile.width / selectedFile.height;
      setWidth(Math.round(val * ratio));
    }
  };

  const handleApplyPreset = (w: number, h: number) => {
    setUnit('pixels');
    setWidth(w);
    setHeight(h);
  };

  const handleRunResize = () => {
    const options: ResizeOptions = {
      width: unit === 'percent' ? percentValue : width,
      height: unit === 'percent' ? percentValue : height,
      maintainAspectRatio: maintainAspect,
      unit,
      format,
      quality,
    };
    processAll(options);
  };

  const hasDoneFiles = files.some((f) => f.status === 'done');

  return (
    <ToolLayout
      title="Image Resizer"
      description="Change image dimensions in pixels or percentages. Keep aspect ratios locked or select standard social media presets."
      toolSlug="image-resizer"
      icon={Maximize2}
      badge="High-Precision"
    >
      <div className="space-y-8">
        <ImageUploader onFilesSelected={addFiles} multiple={true} />

        {files.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Col */}
            <div className="lg:col-span-1 space-y-6">
              <ImageList
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onRemoveFile={removeFile}
                onClearAll={clearAllFiles}
              />

              {/* Resize Controls */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Resize Controls</h3>
                  </div>

                  {/* Mode switcher */}
                  <div className="flex items-center bg-secondary rounded-lg p-1 text-xs">
                    <button
                      onClick={() => setUnit('pixels')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                        unit === 'pixels'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Pixels
                    </button>
                    <button
                      onClick={() => setUnit('percent')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                        unit === 'percent'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Percentage
                    </button>
                  </div>
                </div>

                {/* Pixel Mode */}
                {unit === 'pixels' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Width (px)</label>
                        <input
                          type="number"
                          min="1"
                          value={width || ''}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Height (px)</label>
                        <input
                          type="number"
                          min="1"
                          value={height || ''}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMaintainAspect(!maintainAspect)}
                      className="flex items-center gap-2 text-xs text-foreground font-medium hover:text-primary transition-colors cursor-pointer"
                    >
                      {maintainAspect ? (
                        <Lock className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span>Lock Aspect Ratio</span>
                    </button>

                    {/* Presets List */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                        Popular Presets
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {RESIZE_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleApplyPreset(preset.width, preset.height)}
                            className="p-1.5 text-left rounded-lg bg-secondary/70 hover:bg-secondary border border-border/40 text-[11px] transition-colors"
                          >
                            <p className="font-semibold text-foreground truncate">{preset.label.split(' (')[0]}</p>
                            <p className="text-muted-foreground text-[10px]">
                              {preset.width} × {preset.height}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Percentage Mode */
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Scale</span>
                      <span className="font-bold text-primary">{percentValue}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={percentValue}
                      onChange={(e) => setPercentValue(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[25, 50, 75, 150].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setPercentValue(pct)}
                          className="py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 border border-border/40 text-foreground font-medium"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    onClick={handleRunResize}
                    disabled={isProcessing || files.length === 0}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isProcessing
                      ? 'Resizing...'
                      : `Resize ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`}
                  </Button>

                  {hasDoneFiles && (
                    <Button
                      variant="outline"
                      onClick={() => downloadAllAsZip('resized_images.zip')}
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
