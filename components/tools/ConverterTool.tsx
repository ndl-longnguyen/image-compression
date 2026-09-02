'use client';

import React, { useState } from 'react';
import { ConvertOptions, ImageFormat, SUPPORTED_FORMATS } from '@/lib/image/types';
import { convertSingleImage } from '@/lib/image/convertImage';
import { useBatchProcessor } from '@/hooks/useBatchProcessor';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { ImageList } from '@/components/image/ImageList';
import { ImagePreview } from '@/components/image/ImagePreview';
import { BatchProgressBar } from '@/components/image/BatchProgressBar';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Archive, Sliders } from 'lucide-react';

const CONVERSION_SHORTCUTS: { label: string; format: ImageFormat }[] = [
  { label: 'To WebP (Best Size)', format: 'webp' },
  { label: 'To JPG (Universal)', format: 'jpeg' },
  { label: 'To PNG (Lossless)', format: 'png' },
  { label: 'To BMP (Raw)', format: 'bmp' },
];

export function ConverterTool() {
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('webp');
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
  } = useBatchProcessor<ConvertOptions>(convertSingleImage);

  const handleRunConvert = () => {
    processAll({
      targetFormat,
      quality,
    });
  };

  const hasDoneFiles = files.some((f) => f.status === 'done');

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images in batch between JPG, PNG, WebP, GIF, and BMP formats directly in your browser. Fast, free, and completely private."
      toolSlug="image-converter"
      icon={RefreshCw}
      badge="Batch Support"
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
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Conversion Settings</h3>
                </div>

                {/* Shortcuts */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Quick Shortcuts
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONVERSION_SHORTCUTS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setTargetFormat(s.format)}
                        className={`p-2 text-xs rounded-lg font-medium border text-left transition-colors ${
                          targetFormat === s.format
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border-border/60'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Format dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SUPPORTED_FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quality Slider (for lossy formats) */}
                {targetFormat !== 'png' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Quality</span>
                      <span className="font-bold text-primary">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleRunConvert}
                    disabled={isProcessing || files.length === 0}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isProcessing
                      ? 'Converting...'
                      : `Convert ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`}
                  </Button>

                  {hasDoneFiles && (
                    <Button
                      variant="outline"
                      onClick={() => downloadAllAsZip('converted_images.zip')}
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
