import { MAIN_SITE_URL } from "@/lib/config/site"
import Link from 'next/link';
import {
  Minimize2,
  Maximize2,
  Crop,
  RefreshCw,
  RotateCw,
  Sliders,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Online Image Tools - Free, Fast & Private Image Processing in Browser',
  description:
    'Compress, resize, crop, convert, rotate, and edit images directly in your browser. 100% private with zero server uploads.',
};

const POPULAR_TOOLS = [
  {
    title: 'Image Compressor',
    slug: '/image-compressor',
    description:
      'Reduce file size of JPG, PNG, and WebP images by up to 80% while preserving crisp quality.',
    icon: Minimize2,
    badge: 'Popular',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500',
  },
  {
    title: 'Image Resizer',
    slug: '/image-resizer',
    description:
      'Change image dimensions in pixels or percentages. Keep aspect ratio or use social media presets.',
    icon: Maximize2,
    badge: 'Essential',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-500',
  },
  {
    title: 'Image Cropper',
    slug: '/image-cropper',
    description:
      'Crop images to exact ratios (1:1, 16:9, 4:3, 9:16) with interactive zoom, rotation, and pan.',
    icon: Crop,
    badge: 'Interactive',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-500',
  },
  {
    title: 'Image Converter',
    slug: '/image-converter',
    description:
      'Convert between JPG, PNG, WebP, GIF, and BMP in batch mode right in your browser.',
    icon: RefreshCw,
    badge: 'Batch',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-500',
  },
  {
    title: 'Rotate & Flip',
    slug: '/image-rotate',
    description:
      'Rotate photos 90°, 180°, 270° or flip horizontally and vertically in a single click.',
    icon: RotateCw,
    badge: 'Quick',
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-500',
  },
  {
    title: 'Editor & Watermark',
    slug: '/image-editor',
    description:
      'Adjust brightness, contrast, color filters, add custom text watermarks or logo stamps with undo/redo.',
    icon: Sliders,
    badge: 'Advanced',
    color: 'from-indigo-500/20 to-sky-500/20 border-indigo-500/30 text-indigo-500',
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Blazing Fast Speed',
    description:
      'Processes files in milliseconds directly on your GPU/CPU using native Web Canvas.',
  },
  {
    icon: ShieldCheck,
    title: '100% Client-Side Privacy',
    description:
      'Your photos never leave your device. Zero cloud uploads, zero data retention.',
  },
  {
    icon: Layers,
    title: 'Batch Processing & ZIP',
    description:
      'Process dozens of images at once and download everything neatly packaged in a ZIP file.',
  },
  {
    icon: Lock,
    title: 'No Registration Required',
    description:
      'Free for everyone, forever. No sign-up, no watermark forced on your output, no subscriptions.',
  },
];

const FAQS = [
  {
    question: 'Are my images uploaded to any server?',
    answer:
      'No. Every single operation (compression, resizing, cropping, conversion, editing) takes place 100% inside your web browser using HTML5 Canvas. Your photos are never transmitted over the network.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'We support JPEG, PNG, WebP, GIF (static), BMP, and AVIF (on compatible modern browsers). You can convert freely between them.',
  },
  {
    question: 'Can I process multiple images at once?',
    answer:
      'Yes! Our batch processing engine allows you to upload multiple files, process them all with your chosen settings, and download them either individually or as a single ZIP archive.',
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'You can comfortably process images up to 50MB each. Since processing happens locally in your browser memory, performance scales with your device capabilities.',
  },
  {
    question: 'How do I paste an image from my clipboard?',
    answer:
      'Simply copy any image or screenshot from your clipboard and press Ctrl + V (or Cmd + V on Mac) anywhere inside the tool page!',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center space-y-8 pt-4 sm:pt-8">
        {/* Emblem / Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-yellow-500/40 to-amber-600/30 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <img
              src="/logo.png"
              alt="Logo"
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl border-2 border-amber-500/40 ring-4 ring-black/10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Next-Generation Online Image Suite</span>
            </span>
            <a
              href="{MAIN_SITE_URL}"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-foreground text-xs font-medium border border-border/70 hover:border-primary/50 transition-all group"
              title="Visit Nguyen Dai Long's Profile"
            >
              <span>By</span>
              <strong className="text-primary group-hover:underline">Nguyen Dai Long (NDL)</strong>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Free Online Image Tools
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Compress, resize, crop, convert, and edit your photos directly in your browser.
            Complete privacy, zero file uploads, lightning speed.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/image-compressor">
            <Button size="lg" className="gap-2 px-6 h-12 text-base font-semibold shadow-md">
              <Minimize2 className="w-5 h-5" />
              Compress Images
            </Button>
          </Link>
          <Link href="/image-converter">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-6 h-12 text-base font-semibold hover:bg-secondary"
            >
              <RefreshCw className="w-5 h-5" />
              Convert Format
            </Button>
          </Link>
        </div>

        {/* Client side privacy note */}
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your images are processed locally on your device and are never sent to a server.</span>
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Popular Image Tools
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select a specialized tool below to begin processing your photos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.slug}
                className="group relative p-6 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br border ${tool.color} shadow-xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-foreground/80 border border-border/60">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {tool.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/40 mt-4 flex items-center text-xs font-semibold text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us / Features */}
      <section className="max-w-7xl mx-auto rounded-3xl bg-secondary/40 border border-border/60 p-8 sm:p-12 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Why Use Online Image Tools?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Engineered from the ground up for privacy, speed, and ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border/60 space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto space-y-10 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Simple 3-step workflow with instantaneous feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3 relative">
            <span className="text-3xl font-black text-primary/20">01</span>
            <h3 className="font-bold text-lg text-foreground">Upload or Paste</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Drag and drop your images, click to select, or simply press Ctrl + V to paste straight from your clipboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3 relative">
            <span className="text-3xl font-black text-primary/20">02</span>
            <h3 className="font-bold text-lg text-foreground">Customize Settings</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adjust quality sliders, pick target dimensions, crop area, rotation angle, or apply artistic filters with instant preview.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3 relative">
            <span className="text-3xl font-black text-primary/20">03</span>
            <h3 className="font-bold text-lg text-foreground">Download Instantly</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save individual optimized photos, or download all processed items together as a single neat ZIP file.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about our browser-based image toolkit.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-card border border-border/60 space-y-2 shadow-xs"
            >
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                {faq.question}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Spotlight */}
      <section className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-amber-500/10 border border-border/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 to-primary/40 rounded-full blur-xs"></div>
              <img
                src="/logo.png"
                alt="NDL Logo"
                className="relative w-16 h-16 rounded-full object-cover border-2 border-primary/40 shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Developed by
              </span>
              <h3 className="text-xl font-extrabold text-foreground">
                Nguyen Dai Long (NDL)
              </h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Software Engineer specializing in scalable backend systems, high-performance web applications, and modern cloud architectures.
              </p>
            </div>
          </div>

          <a
            href="{MAIN_SITE_URL}"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="lg" className="gap-2 font-semibold shadow-xs">
              <Globe className="w-4 h-4" />
              <span>Visit NDL Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
