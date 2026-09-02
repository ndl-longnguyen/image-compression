'use client';

import React, { useState } from 'react';
import { ImageFile } from '@/lib/image/types';
import { formatFileSize } from '@/lib/image/canvasUtils';
import { Columns, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  imageFile: ImageFile;
  className?: string;
}

export function ImagePreview({ imageFile, className }: ImagePreviewProps) {
  const [viewMode, setViewMode] = useState<'split' | 'processed' | 'original'>('split');
  const result = imageFile.result;

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border shadow-xs space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-base text-foreground">Preview & Comparison</h3>
        </div>

        {result && (
          <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode('processed')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'processed'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Result Only
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'original'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Original
            </button>
          </div>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="relative min-h-[300px] flex items-center justify-center rounded-xl bg-muted/20 border border-border/60 p-4 overflow-hidden">
        {result ? (
          viewMode === 'split' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Original */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span className="font-semibold text-foreground">Original</span>
                  <span>{formatFileSize(result.originalSize)}</span>
                </div>
                <div className="relative aspect-video max-h-[360px] rounded-lg overflow-hidden border border-border/80 bg-background/50 flex items-center justify-center">
                  <img
                    src={imageFile.previewUrl}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Processed Result
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatFileSize(result.outputSize)} (-{result.savedPercentage}%)
                  </span>
                </div>
                <div className="relative aspect-video max-h-[360px] rounded-lg overflow-hidden border border-primary/40 bg-background/50 flex items-center justify-center ring-2 ring-primary/10">
                  <img
                    src={result.downloadUrl}
                    alt="Processed"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          ) : viewMode === 'processed' ? (
            <div className="w-full flex flex-col items-center max-h-[440px]">
              <img
                src={result.downloadUrl}
                alt="Processed Result"
                className="max-h-[400px] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center max-h-[440px]">
              <img
                src={imageFile.previewUrl}
                alt="Original"
                className="max-h-[400px] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          )
        ) : (
          <div className="w-full flex flex-col items-center max-h-[440px]">
            <img
              src={imageFile.previewUrl}
              alt="Preview"
              className="max-h-[400px] max-w-full object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Result Metrics */}
      {result && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-secondary/50 border border-border/60 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Original Size</p>
            <p className="text-sm font-bold text-foreground">
              {formatFileSize(result.originalSize)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New Size</p>
            <p className="text-sm font-bold text-primary">
              {formatFileSize(result.outputSize)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Space Saved</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {result.savedPercentage}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
