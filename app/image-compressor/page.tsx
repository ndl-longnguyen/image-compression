import { CompressorTool } from '@/components/tools/CompressorTool';

export const metadata = {
  title: 'Image Compressor – Compress JPG, PNG, WebP Images Online Free',
  description:
    'Compress JPG, PNG, and WebP images online directly in your browser. Reduce file size while maintaining pristine quality with zero server uploads.',
};

export default function CompressorPage() {
  return <CompressorTool />;
}
