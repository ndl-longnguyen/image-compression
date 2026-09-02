import Link from 'next/link';
import { TOOL_NAV_ITEMS } from '@/lib/navigation';
import { ShieldCheck, Lock, Zap, ExternalLink, Globe, Mail, Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              High-performance, privacy-focused browser toolkit created by{' '}
              <a
                href="https://longnd.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-semibold hover:text-primary underline underline-offset-4 decoration-primary/40 transition-colors"
              >
                Nguyen Dai Long (NDL)
              </a>
              . All image operations run 100% locally.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Cloud Uploads</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>100% Private</span>
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

          {/* Formats Col */}
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

          {/* Creator Profile Col */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <span>Creator Profile</span>
            </h4>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with the developer behind this project:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://longnd.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>NDL Portfolio Website</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ndl-longnguyen/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.39 9.74v-8.37H5.07v8.37z" />
                    </svg>
                    <span>LinkedIn Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ndl.long.nguyendai@gmail.com"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact via Email</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Online Image Tools. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Designed & Built by</span>
            <a
              href="https://longnd.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
            >
              <span>Nguyen Dai Long (NDL)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
