'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/image/fileValidation';
import { useClipboardPaste } from '@/hooks/useClipboardPaste';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

export function ImageUploader({
  onFilesSelected,
  multiple = true,
  accept = 'image/*',
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = useCallback(
    (fileList: FileList | File[]) => {
      setErrorMessage(null);
      const incoming = Array.from(fileList);
      if (incoming.length === 0) return;

      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of incoming) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else if (validation.error) {
          errors.push(validation.error);
        }
      }

      if (errors.length > 0) {
        setErrorMessage(errors[0]);
      }

      if (validFiles.length > 0) {
        const selected = multiple ? validFiles : [validFiles[0]];
        onFilesSelected(selected);
      }
    },
    [multiple, onFilesSelected]
  );

  // Enable Ctrl+V paste
  useClipboardPaste((pastedFiles) => {
    processFileList(pastedFiles);
  });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'group relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01] ring-4 ring-primary/20'
            : 'border-border/80 hover:border-primary/60 bg-card hover:bg-card/80 hover:shadow-md'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files) {
              processFileList(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm',
              isDragging
                ? 'bg-primary text-primary-foreground scale-110'
                : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110'
            )}
          >
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <p className="text-base sm:text-lg font-bold text-foreground">
              Drag & Drop your images here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground font-medium border border-border/60">
              <Clipboard className="w-3 h-3 text-primary" /> Ctrl + V to Paste
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground font-medium border border-border/60">
              <ImageIcon className="w-3 h-3 text-amber-500" /> JPG, PNG, WebP, GIF, BMP
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground font-medium border border-border/60">
              Max 50MB
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="flex-1">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
