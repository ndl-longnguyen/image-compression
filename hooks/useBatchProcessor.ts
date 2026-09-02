'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageFile, ProcessResult, BatchProgress } from '@/lib/image/types';
import { getImageDimensions, revokeBlobUrl, downloadBlob } from '@/lib/image/canvasUtils';
import { createZipArchive, ZipFileEntry } from '@/lib/image/zipUtils';

export function useBatchProcessor<TOptions>(
  processFn: (file: File, options: TOptions) => Promise<ProcessResult>
) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    inProgress: 0,
    failed: 0,
    isProcessing: false,
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        revokeBlobUrl(f.previewUrl);
        if (f.result?.downloadUrl) {
          revokeBlobUrl(f.result.downloadUrl);
        }
      });
    };
  }, [files]);

  const addFiles = useCallback(async (newRawFiles: File[]) => {
    const newItems: ImageFile[] = [];

    for (const file of newRawFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      let width = 0;
      let height = 0;

      try {
        const dims = await getImageDimensions(file);
        width = dims.width;
        height = dims.height;
      } catch {
        // Fallback if dimensions cannot be immediately read
      }

      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        width,
        height,
        status: 'idle',
      });
    }

    setFiles((prev) => {
      const updated = [...prev, ...newItems];
      if (!selectedFileId && updated.length > 0) {
        setSelectedFileId(updated[0].id);
      }
      return updated;
    });
  }, [selectedFileId]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        revokeBlobUrl(target.previewUrl);
        if (target.result?.downloadUrl) {
          revokeBlobUrl(target.result.downloadUrl);
        }
      }
      const filtered = prev.filter((f) => f.id !== id);
      if (selectedFileId === id) {
        setSelectedFileId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [selectedFileId]);

  const clearAllFiles = useCallback(() => {
    files.forEach((f) => {
      revokeBlobUrl(f.previewUrl);
      if (f.result?.downloadUrl) {
        revokeBlobUrl(f.result.downloadUrl);
      }
    });
    setFiles([]);
    setSelectedFileId(null);
    setProgress({
      total: 0,
      completed: 0,
      inProgress: 0,
      failed: 0,
      isProcessing: false,
    });
  }, [files]);

  const processAll = useCallback(
    async (options: TOptions) => {
      if (files.length === 0 || isProcessing) return;

      setIsProcessing(true);
      let completedCount = 0;
      let failedCount = 0;

      setProgress({
        total: files.length,
        completed: 0,
        inProgress: 1,
        failed: 0,
        isProcessing: true,
      });

      for (let i = 0; i < files.length; i++) {
        const item = files[i];

        // Mark current item as processing
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'processing', error: undefined } : f))
        );

        setProgress((p) => ({
          ...p,
          inProgress: i + 1,
        }));

        try {
          // Allow UI paint cycle to breathe
          await new Promise((r) => setTimeout(r, 16));

          const result = await processFn(item.file, options);

          completedCount++;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: 'done', result, error: undefined } : f
            )
          );
        } catch (err) {
          failedCount++;
          const errorMessage = err instanceof Error ? err.message : 'Processing failed';
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: 'error', error: errorMessage } : f
            )
          );
        }

        setProgress((p) => ({
          ...p,
          completed: completedCount,
          failed: failedCount,
        }));
      }

      setIsProcessing(false);
      setProgress((p) => ({
        ...p,
        isProcessing: false,
      }));
    },
    [files, isProcessing, processFn]
  );

  const downloadAllAsZip = useCallback(
    async (zipFilename: string = 'processed_images.zip') => {
      const processedItems = files.filter((f) => f.status === 'done' && f.result);
      if (processedItems.length === 0) return;

      setIsZipping(true);
      try {
        const zipEntries: ZipFileEntry[] = processedItems.map((item) => ({
          filename: item.result!.filename,
          data: item.result!.blob,
        }));

        const zipBlob = await createZipArchive(zipEntries);
        downloadBlob(zipBlob, zipFilename);
      } catch (err) {
        console.error('Failed to generate ZIP archive:', err);
      } finally {
        setIsZipping(false);
      }
    },
    [files]
  );

  const selectedFile = files.find((f) => f.id === selectedFileId) || files[0] || null;

  return {
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
  };
}
