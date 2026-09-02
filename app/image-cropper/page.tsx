import { CropperTool } from '@/components/tools/CropperTool';

export const metadata = {
  title: 'Image Cropper – Crop Images Online to Any Ratio Free',
  description:
    'Crop JPG, PNG, and WebP images online directly in your browser. Choose standard aspect ratios (1:1, 16:9, 4:3, 9:16) with zero server uploads.',
};

export default function CropperPage() {
  return <CropperTool />;
}
