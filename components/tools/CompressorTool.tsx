'use client';

import React, { useState } from 'react';
import { CompressOptions, ImageFormat, SUPPORTED_FORMATS } from '@/lib/image/types';
import { compressSingleImage } from '@/lib/image/compressImage';
import { useBatchProcessor } from '@/hooks/useBatchProcessor';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { ImageList } from '@/components/image/ImageList';
import { ImagePreview } from '@/components/image/ImagePreview';
import { BatchProgressBar } from '@/components/image/BatchProgressBar';
import { Button } from '@/components/ui/button';
import { Minimize2, Download, Archive, Play, Sliders } from 'lucide-react';

const PRESETS = [
  { label: 'Low (95% Quality)', quality: 95 },
  { label: 'Medium (80% Quality)', quality: 80 },
  { label: 'High (60% Quality)', quality: 60 },
];

export function CompressorTool() {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<ImageFormat>('webp');
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [maxHeight, setMaxHeight] = useState<string>('');

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
  } = useBatchProcessor<CompressOptions>(compressSingleImage);

  const handleRunCompress = () => {
    const options: CompressOptions = {
      quality,
      format,
      maxWidth: maxWidth ? parseInt(maxWidth, 10) : undefined,
      maxHeight: maxHeight ? parseInt(maxHeight, 10) : undefined,
      maintainAspectRatio: true,
    };
    processAll(options);
  };

  const hasDoneFiles = files.some((f) => f.status === 'done');

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress JPG, PNG, and WebP images online directly in your browser. Dramatically reduce file size without sacrificing visual sharpness."
      toolSlug="image-compressor"
      icon={Minimize2}
      badge="Client-Side"
    >
      <div className="space-y-8">
        {/* Upload Area */}
        <ImageUploader onFilesSelected={addFiles} multiple={true} />

        {files.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Files & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Image List */}
              <ImageList
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onRemoveFile={removeFile}
                onClearAll={clearAllFiles}
              />

              {/* Compression Settings Card */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Settings</h3>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setQuality(p.quality)}
                        className={`py-1.5 px-2 text-xs rounded-lg font-medium border transition-colors ${
                          quality === p.quality
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border-border/60'
                        }`}
                      >
                        {p.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">Quality</span>
                    <span className="font-bold text-primary">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Smaller Size</span>
                    <span>Best Quality</span>
                  </div>
                </div>

                {/* Output Format */}
                <div className="space-y-2">
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

                {/* Optional Resize Constraints */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Max Dimensions (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        placeholder="Max Width"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max Height"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleRunCompress}
                    disabled={isProcessing || files.length === 0}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isProcessing
                      ? 'Compressing...'
                      : `Compress ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`}
                  </Button>

                  {hasDoneFiles && (
                    <Button
                      variant="outline"
                      onClick={() => downloadAllAsZip('compressed_images.zip')}
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

            {/* Right Column: Preview & Progress */}
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
