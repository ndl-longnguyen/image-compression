import { ConverterTool } from '@/components/tools/ConverterTool';

export const metadata = {
  title: 'Image Converter – Convert JPG, PNG, WebP, GIF Online Free',
  description:
    'Convert images between JPG, PNG, WebP, GIF, and BMP formats in batch directly in your browser. 100% private, zero uploads.',
};

export default function ConverterPage() {
  return <ConverterTool />;
}
