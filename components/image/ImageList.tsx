'use client';

import React from 'react';
import { ImageFile } from '@/lib/image/types';
import { formatFileSize, downloadBlob } from '@/lib/image/canvasUtils';
import { X, Check, Loader2, AlertCircle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageListProps {
  files: ImageFile[];
  selectedFileId?: string | null;
  onSelectFile?: (id: string) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
  title?: string;
}

export function ImageList({
  files,
  selectedFileId,
  onSelectFile,
  onRemoveFile,
  onClearAll,
  title = 'Selected Files',
}: ImageListProps) {
  if (files.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base text-foreground">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {files.map((file) => {
          const isSelected = selectedFileId === file.id;

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile && onSelectFile(file.id)}
              className={cn(
                'group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200',
                onSelectFile ? 'cursor-pointer' : '',
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                  : 'border-border/60 hover:border-primary/40 bg-card hover:bg-card/80'
              )}
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted/30">
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  {file.width > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {file.width} × {file.height} px
                      </span>
                    </>
                  )}
                  {file.result && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatFileSize(file.result.outputSize)} (-{file.result.savedPercentage}%)
                      </span>
                    </>
                  )}
                </div>
                {file.error && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="truncate">{file.error}</span>
                  </p>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 shrink-0">
                {file.status === 'processing' && (
                  <span className="p-1 rounded-full bg-primary/10 text-primary animate-spin">
                    <Loader2 className="w-4 h-4" />
                  </span>
                )}
                {file.status === 'done' && (
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="p-1 rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                )}

                {/* Direct Download button if done */}
                {file.result && (
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file.result) {
                        downloadBlob(file.result.blob, file.result.filename);
                      }
                    }}
                    title="Download this file"
                  >
                    <Download className="w-3 h-3 text-primary" />
                  </Button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
