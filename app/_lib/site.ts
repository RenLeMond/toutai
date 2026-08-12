import type { Metadata } from 'next';

export const siteUrl = 'https://toutai.online';
export const siteName = '投胎模拟器';

export const defaultDescription =
  '如果来世还在种花家，你会出生在哪里？根据最新人口普查数据，模拟你在中国的出生省份、性别与家庭排行。';

export const defaultKeywords = [
  '投胎模拟器',
  '投胎模拟器中国版',
  '出生概率',
  '省份出生概率',
  '你会出生在哪里',
  '中国出生模拟',
  '人口普查',
  'toutai'
];

type PageSeo = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

const pages: Record<string, PageSeo> = {
  home: {
    title: siteName,
    description: defaultDescription,
    path: '/',
    keywords: defaultKeywords
  },
  about: {
    title: `关于 - ${siteName}`,
    description:
      '了解投胎模拟器中国版：根据全国出生人口数据，计算你出生在各省份的可能性。',
    path: '/about',
    keywords: ['投胎模拟器', '关于', '出生概率计算']
  },
  data: {
    title: `数据来源 - ${siteName}`,
    description:
      '投胎模拟器使用的数据来源：第七次全国人口普查及港澳台最新人口统计。',
    path: '/data',
    keywords: ['人口普查', '出生人口数据', '统计数据来源']
  },
  probability: {
    title: `概率计算器 - ${siteName}`,
    description:
      '计算你出生在指定省份的概率。输入目标地区，查看出生可能性与数学公式。',
    path: '/probability',
    keywords: ['出生概率计算器', '省份概率', '概率计算']
  }
};

export function createPageMetadata(pageKey: keyof typeof pages): Metadata {
  const page = pages[pageKey];
  const url = `${siteUrl}${page.path}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords ?? defaultKeywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url,
      siteName,
      title: page.title,
      description: page.description
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description
    }
  };
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  inLanguage: 'zh-CN'
};

export const sitemapEntries = [
  { path: '/', priority: 1 },
  { path: '/probability', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/data', priority: 0.6 }
] as const;
