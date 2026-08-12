import type { MetadataRoute } from 'next';
import { siteName } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: '根据人口普查数据，模拟你在中国的出生省份、性别与家庭排行。',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f3ef',
    theme_color: '#ff4f04',
    icons: [
      {
        src: '/icons/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
