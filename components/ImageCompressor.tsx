'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  compressImage,
  formatFileSize,
  downloadBlob,
  SUPPORTED_FORMATS,
  CompressionOptions,
  CompressionResult,
  getPresetLevel,
} from '@/lib/imageCompression';
import { Upload, Download, X } from 'lucide-react';

type PresetLevel = 'low' | 'medium' | 'high';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedResult, setCompressedResult] = useState<CompressionResult | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string>('');

  // Compression options
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<string>('jpeg');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [presetLevel, setPresetLevel] = useState<PresetLevel>('medium');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setOriginalFile(file);
    setError('');
    setCompressedResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setIsCompressing(true);
    setError('');

    try {
      const options: CompressionOptions = {
        quality,
        format: format as any,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        maintainAspectRatio: maintainAspect,
      };

      const result = await compressImage(originalFile, options);
      setCompressedResult(result);

      // Create preview
      const url = URL.createObjectURL(result.data);
      setCompressedPreview(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
      console.error('[v0] Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedResult || !originalFile) return;

    const formatInfo = SUPPORTED_FORMATS.find((f) => f.value === format);
    const extension = formatInfo?.extension || 'jpg';
    const filename = `${originalFile.name.split('.')[0]}_compressed.${extension}`;

    downloadBlob(compressedResult.data, filename);
  };

  const handlePresetChange = (preset: PresetLevel) => {
    setPresetLevel(preset);
    const level = getPresetLevel(preset);
    setQuality(level.quality);
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalPreview('');
    setCompressedResult(null);
    setCompressedPreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Image Compressor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compress your images directly in your browser with advanced options.
            No uploads to servers, complete privacy and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Step 1: Upload Image
              </h2>

              <div
                ref={dragRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-primary/5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-foreground font-semibold mb-2">
                    Drag and drop your image here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPEG, PNG, WebP, GIF, BMP, TIFF
                  </p>
                </div>
              </div>

              {originalFile && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {originalFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(originalFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={handleClear}
                      className="p-1 hover:bg-primary/20 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>
              )}

              {originalPreview && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Original Preview
                  </h3>
                  <img
                    src={originalPreview}
                    alt="Original"
                    className="w-full h-64 object-contain rounded-lg border border-border"
                  />
                </div>
              )}
            </div>

            {/* Compression Options */}
            {originalFile && (
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Step 2: Compression Settings
                </h2>

                <div className="space-y-6">
                  {/* Preset Levels */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-3">
                      Preset Levels
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as PresetLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => handlePresetChange(level)}
                          className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                            presetLevel === level
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Custom Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={quality}
                      onChange={(e) => {
                        setQuality(parseInt(e.target.value));
                        setPresetLevel('medium');
                      }}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Lower values = smaller file size, lower quality
                    </p>
                  </div>

                  {/* Format Selection */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Output Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {SUPPORTED_FORMATS.map((fmt) => (
                        <option key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resize Options */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-3">
                      Resize Image (Optional)
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="Auto"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Auto"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={maintainAspect}
                          onChange={(e) => setMaintainAspect(e.target.checked)}
                          className="rounded"
                        />
                        Maintain aspect ratio
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {/* Compress Button */}
                  <Button
                    onClick={handleCompress}
                    disabled={isCompressing || !originalFile}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                  >
                    {isCompressing ? 'Compressing...' : 'Compress Image'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {compressedResult ? (
              <>
                <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Compressed Preview
                  </h2>

                  <img
                    src={compressedPreview}
                    alt="Compressed"
                    className="w-full h-64 object-contain rounded-lg border border-border mb-6"
                  />

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Original Size</p>
                      <p className="font-semibold text-foreground">
                        {formatFileSize(compressedResult.originalSize)}
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Compressed Size</p>
                      <p className="font-semibold text-foreground">
                        {formatFileSize(compressedResult.compressedSize)}
                      </p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                      <p className="text-xs text-muted-foreground mb-1">Compression</p>
                      <p className="font-semibold text-accent">
                        {compressedResult.compressionRatio}%
                      </p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                      <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                      <p className="font-semibold text-foreground">
                        {compressedResult.width} × {compressedResult.height}
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Compressed Image
                  </Button>

                  {/* Compress Another Button */}
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    Compress Another Image
                  </Button>
                </div>

                {/* Comparison Info */}
                <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Compression Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="text-foreground font-medium">
                        {compressedResult.mimeType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality Setting:</span>
                      <span className="text-foreground font-medium">{quality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Space Saved:</span>
                      <span className="text-accent font-medium">
                        {formatFileSize(
                          compressedResult.originalSize - compressedResult.compressedSize
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg">
                    Upload an image and configure compression settings to see results here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
