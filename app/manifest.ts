import type { MetadataRoute } from 'next';
import { siteIcon, siteName } from '@/_lib/site';

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
        src: siteIcon,
        sizes: '1024x1024',
        type: 'image/png'
      }
    ]
  };
}
