import type { MetadataRoute } from 'next';
import { siteUrl, sitemapEntries } from '@/_lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries.map(entry => ({
    url: `${siteUrl}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: entry.priority
  }));
}
