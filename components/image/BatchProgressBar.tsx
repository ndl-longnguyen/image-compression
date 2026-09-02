'use client';

import React from 'react';
import { BatchProgress } from '@/lib/image/types';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BatchProgressBarProps {
  progress: BatchProgress;
  className?: string;
}

export function BatchProgressBar({ progress, className }: BatchProgressBarProps) {
  if (!progress.isProcessing && progress.completed === 0 && progress.failed === 0) {
    return null;
  }

  const percentage =
    progress.total > 0
      ? Math.round(((progress.completed + progress.failed) / progress.total) * 100)
      : 0;

  return (
    <div
      className={`p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3 ${
        className || ''
      }`}
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {progress.isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="font-semibold text-foreground">
                Processing {progress.inProgress} of {progress.total}...
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-foreground">Batch Processing Complete!</span>
            </>
          )}
        </div>
        <span className="text-xs font-bold text-primary">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Completed: {progress.completed}</span>
        {progress.failed > 0 && (
          <span className="text-destructive flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3 h-3" />
            Failed: {progress.failed}
          </span>
        )}
        <span>Total: {progress.total}</span>
      </div>
    </div>
  );
}
