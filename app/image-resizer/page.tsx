import { ResizerTool } from '@/components/tools/ResizerTool';

export const metadata = {
  title: 'Image Resizer – Resize JPG, PNG, WebP Images Online Free',
  description:
    'Change image dimensions in pixels or percentages. Maintain aspect ratios and apply standard social media presets directly in your browser.',
};

export default function ResizerPage() {
  return <ResizerTool />;
}
