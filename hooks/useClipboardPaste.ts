'use client';

import { useEffect, useCallback } from 'react';
import { validateImageFile } from '@/lib/image/fileValidation';

export function useClipboardPaste(
  onFilesPasted: (files: File[]) => void,
  enabled: boolean = true
) {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (!enabled) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      const validFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const validation = validateImageFile(file);
            if (validation.valid) {
              validFiles.push(file);
            }
          }
        }
      }

      if (validFiles.length > 0) {
        event.preventDefault();
        onFilesPasted(validFiles);
      }
    },
    [enabled, onFilesPasted]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);
}
