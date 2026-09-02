import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ndl-image-tools.vercel.app';
  const currentDate = new Date();

  const routes = [
    '',
    '/image-compressor',
    '/image-resizer',
    '/image-cropper',
    '/image-converter',
    '/image-rotate',
    '/image-editor',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
