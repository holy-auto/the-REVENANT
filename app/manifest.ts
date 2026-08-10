import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店',
    short_name: site.name,
    description: site.concept,
    start_url: '/',
    display: 'standalone',
    lang: 'ja',
    background_color: '#0878e8',
    theme_color: '#0878e8',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
