import {
  Minimize2,
  Maximize2,
  Crop,
  RefreshCw,
  RotateCw,
  Sliders,
  LucideIcon,
} from 'lucide-react';

export interface ToolNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const TOOL_NAV_ITEMS: ToolNavItem[] = [
  {
    href: '/image-compressor',
    label: 'Compressor',
    icon: Minimize2,
    description: 'Compress JPG, PNG, WebP without quality loss',
  },
  {
    href: '/image-resizer',
    label: 'Resizer',
    icon: Maximize2,
    description: 'Resize dimensions in pixels or percentages',
  },
  {
    href: '/image-cropper',
    label: 'Cropper',
    icon: Crop,
    description: 'Crop to exact ratios with interactive boundary',
  },
  {
    href: '/image-converter',
    label: 'Converter',
    icon: RefreshCw,
    description: 'Convert between WebP, JPG, PNG, GIF, BMP',
  },
  {
    href: '/image-rotate',
    label: 'Rotate & Flip',
    icon: RotateCw,
    description: 'Rotate 90/180/270 degrees or mirror image',
  },
  {
    href: '/image-editor',
    label: 'Editor & Watermark',
    icon: Sliders,
    description: 'Fine-tune colors, filters, text & logo stamps',
  },
];
