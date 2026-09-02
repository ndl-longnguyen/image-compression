'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, LucideIcon, ExternalLink } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  toolSlug: string;
  icon: LucideIcon;
  badge?: string;
  children: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  toolSlug,
  icon: Icon,
  badge,
  children,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">{title}</span>
          </nav>

          <a
            href="https://longnd.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
            title="Nguyen Dai Long (NDL) Portfolio"
          >
            <span>Crafted by NDL</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Tool Header */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-2">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </header>

        {/* Tool Workspace */}
        <main className="space-y-8">{children}</main>
      </div>
    </div>
  );
}
