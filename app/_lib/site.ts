import type { Metadata } from 'next';

export const siteUrl = 'https://toutai.online';
export const siteName = '投胎模拟器';

/** Bump when icon assets change to bust browser/PWA cache. */
export const iconVersion = '2';

function versionedIcon(path: string) {
  return `${path}?v=${iconVersion}`;
}

/** Favicon / OG / PWA large icon */
export const siteIcon = versionedIcon('/icons/app-icon-512.png');
/** Nav bar & share card small icon */
export const siteIconSmall = versionedIcon('/icons/app-icon-64.png');
export const siteIcon192 = versionedIcon('/icons/app-icon-192.png');
export const chinaEditionTitle = `${siteName} 「中国版」`;
export const worldEditionTitle = `${siteName} 「世界版」`;
export const dynastyEditionTitle = `${siteName} 「王朝版」`;

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
    title: chinaEditionTitle,
    description: defaultDescription,
    path: '/',
    keywords: defaultKeywords
  },
  about: {
    title: `关于 - ${chinaEditionTitle}`,
    description:
      '了解投胎模拟器中国版：根据全国出生人口数据，计算你出生在各省份的可能性。',
    path: '/about',
    keywords: ['投胎模拟器', '关于', '出生概率计算', '投胎模拟器中国版']
  },
  data: {
    title: `数据来源 - ${chinaEditionTitle}`,
    description:
      '投胎模拟器中国版使用的数据来源：第七次全国人口普查及港澳台统计。',
    path: '/data',
    keywords: ['人口普查', '出生人口数据', '统计数据来源']
  },
  worldData: {
    title: `数据来源 - ${worldEditionTitle}`,
    description:
      '投胎模拟器世界版使用的数据来源：世界银行 2024 年全球人口与粗出生率统计。',
    path: '/world/data',
    keywords: ['World Bank', '全球出生人口', '统计数据来源', '投胎模拟器世界版']
  },
  probability: {
    title: `概率计算器 - ${chinaEditionTitle}`,
    description:
      '计算你出生在指定省份的概率。输入目标地区，查看出生可能性与数学公式。',
    path: '/probability',
    keywords: ['出生概率计算器', '省份概率', '概率计算']
  },
  world: {
    title: worldEditionTitle,
    description:
      '如果来世随机投胎到世界上，你会出生在哪里？根据世界银行全球出生人口数据，模拟你在各国家的出生可能性。',
    path: '/world',
    keywords: ['投胎模拟器世界版', '全球出生概率', '国家出生概率', 'Reborn']
  },
  worldAbout: {
    title: `关于 - ${worldEditionTitle}`,
    description:
      '了解投胎模拟器世界版：根据世界银行全球出生人口数据，计算你出生在各国的可能性。',
    path: '/world/about',
    keywords: ['投胎模拟器世界版', '关于', '全球出生概率']
  },
  worldProbability: {
    title: `概率计算器 - ${worldEditionTitle}`,
    description:
      '计算你出生在指定国家的概率。选择目标国家，查看出生可能性与数学公式。',
    path: '/world/probability',
    keywords: ['全球出生概率计算器', '国家概率', '概率计算']
  },
  dynasty: {
    title: dynastyEditionTitle,
    description:
      '如果来世投胎到中国古代，你会成为王侯将相还是布衣百姓？秦至清 13 朝按国祚与人口加权开抽，收集图鉴。',
    path: '/dynasty',
    keywords: ['投胎模拟器王朝版', '古代投胎', '王朝投胎', '王侯将相']
  },
  dynastyAbout: {
    title: `关于 - ${dynastyEditionTitle}`,
    description:
      '了解投胎模拟器王朝版：秦至清 13 朝按国祚与代表人口加权抽取，再按 6 阶社会分层模拟身份。',
    path: '/dynasty/about',
    keywords: ['投胎模拟器王朝版', '关于', '古代阶级']
  },
  dynastyData: {
    title: `数据来源 - ${dynastyEditionTitle}`,
    description:
      '王朝版数据说明：13 朝 × 6 阶示意性分层模型，按国祚 × 代表人口加权，非人口普查数据。',
    path: '/dynasty/data',
    keywords: ['朝代数据', '历史阶级', '投胎模拟器王朝版']
  },
  dynastyProbability: {
    title: `概率计算器 - ${dynastyEditionTitle}`,
    description:
      '计算你投胎在指定朝代与阶级的概率。选择目标朝代与身份，查看可能性。',
    path: '/dynasty/probability',
    keywords: ['朝代概率计算器', '阶级概率', '古代投胎概率']
  },
  dynastyTest: {
    title: `抽卡测试 - ${dynastyEditionTitle}`,
    description: '王朝版均等概率抽卡测试台。',
    path: '/dynasty/test',
    keywords: ['王朝抽卡测试', '均等概率', '王朝版测试']
  },
  test: {
    title: `抽卡测试 - ${dynastyEditionTitle}`,
    description: '王朝版均等概率抽卡测试台。',
    path: '/test',
    keywords: ['王朝抽卡测试', '均等概率', '王朝版测试']
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
      description: page.description,
      images: [
        {
          url: siteIcon,
          width: 512,
          height: 512,
          alt: siteName
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [siteIcon]
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
  { path: '/world', priority: 0.9 },
  { path: '/dynasty', priority: 0.9 },
  { path: '/world/probability', priority: 0.85 },
  { path: '/dynasty/probability', priority: 0.85 },
  { path: '/world/about', priority: 0.6 },
  { path: '/world/data', priority: 0.6 },
  { path: '/dynasty/about', priority: 0.6 },
  { path: '/dynasty/data', priority: 0.6 },
  { path: '/probability', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/data', priority: 0.6 }
] as const;
