'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  EditorOptions,
  EditorAdjustments,
  FilterType,
  ImageFormat,
  ProcessResult,
  SUPPORTED_FORMATS,
  WatermarkTextOptions,
  WatermarkImageOptions,
} from '@/lib/image/types';
import { processEditedImage } from '@/lib/image/editorFilters';
import { downloadBlob, formatFileSize, revokeBlobUrl } from '@/lib/image/canvasUtils';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ImageUploader } from '@/components/image/ImageUploader';
import { Button } from '@/components/ui/button';
import {
  Sliders,
  Sparkles,
  Type,
  Image as ImageIcon,
  RotateCcw,
  Undo2,
  Redo2,
  Download,
  Eye,
} from 'lucide-react';

const INITIAL_ADJUSTMENTS: EditorAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  hue: 0,
  blur: 0,
  sharpen: 0,
  opacity: 100,
};

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Normal', value: 'none' },
  { label: 'Grayscale', value: 'grayscale' },
  { label: 'Sepia', value: 'sepia' },
  { label: 'Vintage', value: 'vintage' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cool', value: 'cool' },
  { label: 'High Contrast', value: 'high-contrast' },
  { label: 'B & W', value: 'black-white' },
];

const WATERMARK_POSITIONS = [
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top Center', value: 'top-center' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom Center', value: 'bottom-center' },
  { label: 'Bottom Right', value: 'bottom-right' },
] as const;

export function EditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'text-wm' | 'image-wm'>('adjust');

  // Editor State
  const [adjustments, setAdjustments] = useState<EditorAdjustments>(INITIAL_ADJUSTMENTS);
  const [filter, setFilter] = useState<FilterType>('none');

  // Text Watermark
  const [enableTextWm, setEnableTextWm] = useState(false);
  const [textWm, setTextWm] = useState<WatermarkTextOptions>({
    text: 'Watermark',
    fontSize: 36,
    fontFamily: 'sans-serif',
    color: '#ffffff',
    opacity: 80,
    position: 'bottom-right',
    rotation: 0,
  });

  // Image Watermark
  const [enableImageWm, setEnableImageWm] = useState(false);
  const [imageWmFile, setImageWmFile] = useState<File | null>(null);
  const [imageWmUrl, setImageWmUrl] = useState<string | null>(null);
  const [imageWmScale, setImageWmScale] = useState<number>(50);
  const [imageWmOpacity, setImageWmOpacity] = useState<number>(85);
  const [imageWmPosition, setImageWmPosition] = useState<(typeof WATERMARK_POSITIONS)[number]['value']>('bottom-right');

  const [format, setFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<{ adjustments: EditorAdjustments; filter: FilterType }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const pushHistory = useCallback(
    (newAdj: EditorAdjustments, newFil: FilterType) => {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push({ adjustments: newAdj, filter: newFil });
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (previewUrl) revokeBlobUrl(previewUrl);
    if (result?.downloadUrl) revokeBlobUrl(result.downloadUrl);

    const url = URL.createObjectURL(selected);
    setFile(selected);
    setPreviewUrl(url);
    setResult(null);
    setAdjustments(INITIAL_ADJUSTMENTS);
    setFilter('none');
    setHistory([{ adjustments: INITIAL_ADJUSTMENTS, filter: 'none' }]);
    setHistoryIndex(0);
  };

  const handleAdjustmentChange = (key: keyof EditorAdjustments, val: number) => {
    const updated = { ...adjustments, [key]: val };
    setAdjustments(updated);
    pushHistory(updated, filter);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    pushHistory(adjustments, newFilter);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setAdjustments(prev.adjustments);
      setFilter(prev.filter);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setAdjustments(next.adjustments);
      setFilter(next.filter);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    setAdjustments(INITIAL_ADJUSTMENTS);
    setFilter('none');
    setEnableTextWm(false);
    setEnableImageWm(false);
    pushHistory(INITIAL_ADJUSTMENTS, 'none');
  };

  const handleWatermarkLogoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const wmFile = e.target.files[0];
      if (imageWmUrl) revokeBlobUrl(imageWmUrl);
      const url = URL.createObjectURL(wmFile);
      setImageWmFile(wmFile);
      setImageWmUrl(url);
      setEnableImageWm(true);
    }
  };

  const handleRunProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const options: EditorOptions = {
        filter,
        adjustments,
        textWatermark: enableTextWm ? textWm : undefined,
        imageWatermark:
          enableImageWm && imageWmUrl
            ? {
                imageBlobUrl: imageWmUrl,
                scale: imageWmScale,
                opacity: imageWmOpacity,
                position: imageWmPosition,
              }
            : undefined,
        format,
        quality,
      };

      const res = await processEditedImage(file, options);
      setResult(res);
    } catch (err) {
      console.error('Editor processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image Editor & Watermark"
      description="Apply artistic filters, fine-tune brightness and contrast, or stamp custom text and logo watermarks with non-destructive undo and redo."
      toolSlug="image-editor"
      icon={Sliders}
      badge="Full Suite"
    >
      <div className="space-y-8">
        {!file && <ImageUploader onFilesSelected={handleFileSelected} multiple={false} />}

        {file && previewUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Col: Editor Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-base text-foreground">Controls</h3>

                  {/* History Undo / Redo & Reset */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      title="Undo"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                      title="Redo"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleReset}
                      title="Reset to Original"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-secondary text-[11px] font-medium">
                  <button
                    onClick={() => setActiveTab('adjust')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      activeTab === 'adjust' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Adjust
                  </button>
                  <button
                    onClick={() => setActiveTab('filters')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      activeTab === 'filters' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Filters
                  </button>
                  <button
                    onClick={() => setActiveTab('text-wm')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      activeTab === 'text-wm' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Text WM
                  </button>
                  <button
                    onClick={() => setActiveTab('image-wm')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      activeTab === 'image-wm' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Logo WM
                  </button>
                </div>

                {/* Tab: Adjustments */}
                {activeTab === 'adjust' && (
                  <div className="space-y-4">
                    {/* Brightness */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">Brightness</span>
                        <span className="text-primary font-bold">{adjustments.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={adjustments.brightness}
                        onChange={(e) => handleAdjustmentChange('brightness', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">Contrast</span>
                        <span className="text-primary font-bold">{adjustments.contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={adjustments.contrast}
                        onChange={(e) => handleAdjustmentChange('contrast', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">Saturation</span>
                        <span className="text-primary font-bold">{adjustments.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={adjustments.saturation}
                        onChange={(e) => handleAdjustmentChange('saturation', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Hue Rotation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">Hue Rotate</span>
                        <span className="text-primary font-bold">{adjustments.hue}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={adjustments.hue}
                        onChange={(e) => handleAdjustmentChange('hue', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">Blur</span>
                        <span className="text-primary font-bold">{adjustments.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        value={adjustments.blur}
                        onChange={(e) => handleAdjustmentChange('blur', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Filters */}
                {activeTab === 'filters' && (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => handleFilterChange(f.value)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-colors ${
                          filter === f.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border-border/60'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab: Text Watermark */}
                {activeTab === 'text-wm' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Enable Text Watermark</span>
                      <input
                        type="checkbox"
                        checked={enableTextWm}
                        onChange={(e) => setEnableTextWm(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded-sm cursor-pointer"
                      />
                    </div>

                    {enableTextWm && (
                      <div className="space-y-3 pt-2 border-t border-border/40">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Watermark Text</label>
                          <input
                            type="text"
                            value={textWm.text}
                            onChange={(e) => setTextWm({ ...textWm, text: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Font Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="150"
                              value={textWm.fontSize}
                              onChange={(e) =>
                                setTextWm({ ...textWm, fontSize: parseInt(e.target.value, 10) || 24 })
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Color</label>
                            <input
                              type="color"
                              value={textWm.color}
                              onChange={(e) => setTextWm({ ...textWm, color: e.target.value })}
                              className="w-full h-8 rounded-lg border border-border bg-card cursor-pointer p-0.5"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Position</label>
                          <select
                            value={textWm.position}
                            onChange={(e) =>
                              setTextWm({
                                ...textWm,
                                position: e.target.value as (typeof WATERMARK_POSITIONS)[number]['value'],
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
                          >
                            {WATERMARK_POSITIONS.map((pos) => (
                              <option key={pos.value} value={pos.value}>
                                {pos.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Logo Watermark */}
                {activeTab === 'image-wm' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Enable Logo Stamp</span>
                      <input
                        type="checkbox"
                        checked={enableImageWm}
                        onChange={(e) => setEnableImageWm(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded-sm cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <label className="text-xs text-muted-foreground block">Select Logo Image (PNG / SVG)</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleWatermarkLogoSelected}
                        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />

                      {imageWmUrl && (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Scale</span>
                              <span className="font-bold text-primary">{imageWmScale}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={imageWmScale}
                              onChange={(e) => setImageWmScale(parseInt(e.target.value, 10))}
                              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Position</label>
                            <select
                              value={imageWmPosition}
                              onChange={(e) =>
                                setImageWmPosition(
                                  e.target.value as (typeof WATERMARK_POSITIONS)[number]['value']
                                )
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
                            >
                              {WATERMARK_POSITIONS.map((pos) => (
                                <option key={pos.value} value={pos.value}>
                                  {pos.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
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

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleRunProcess}
                    disabled={isProcessing}
                    className="w-full gap-2 h-11 text-sm font-semibold"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Apply & Render'}
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

            {/* Right Col: Live Preview & Download */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Interactive Preview</h3>
                  </div>

                  {result && (
                    <Button
                      onClick={() => downloadBlob(result.blob, result.filename)}
                      className="gap-1.5 h-8 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Output
                    </Button>
                  )}
                </div>

                {/* Real-time live filter simulation on image tag */}
                <div className="relative min-h-[380px] max-h-[500px] flex items-center justify-center rounded-xl bg-muted/20 border border-border/60 p-4 overflow-hidden">
                  <img
                    src={result ? result.downloadUrl : previewUrl}
                    alt="Editor Preview"
                    className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm transition-all duration-200"
                    style={
                      !result
                        ? {
                            filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) hue-rotate(${adjustments.hue}deg) blur(${adjustments.blur}px)`,
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Metric Card */}
              {result && (
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-card border border-border/60 text-center text-xs">
                  <div>
                    <span className="text-muted-foreground block">Dimensions</span>
                    <span className="font-bold text-foreground">
                      {result.width} × {result.height} px
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Output Size</span>
                    <span className="font-bold text-primary">{formatFileSize(result.outputSize)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Format</span>
                    <span className="font-bold text-foreground uppercase">
                      {result.mimeType.split('/')[1]}
                    </span>
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
