import Link from 'next/link';
import { TOOL_NAV_ITEMS } from '@/lib/navigation';
import { ShieldCheck, Lock, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-xs"
              />
              <span className="font-bold text-lg tracking-tight text-foreground">
                Online Image Tools
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Fast, high-performance browser-based image toolkit. Compress, resize, crop,
              convert, rotate, and edit images without uploading your sensitive photos to any external server.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Client-Side</span>
              </div>
            </div>
          </div>

          {/* Tools Col */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">
              All Tools
            </h4>
            <ul className="space-y-2.5">
              {TOOL_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Formats Col */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">
              Supported Formats
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>WebP (Google Modern)</li>
              <li>JPEG / JPG</li>
              <li>PNG (Transparency)</li>
              <li>GIF (Static Frames)</li>
              <li>BMP & AVIF</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Online Image Tools. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for privacy & speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
