'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text, View } from 'reshaped';
import { resolveAppVersion, useAppVersion } from '@/lib/store/useAppVersion';
import { siteUrl } from '@/lib/site';

function SiteFooter() {
  const pathname = usePathname();
  const storedVersion = useAppVersion(state => state.version);
  const activeVersion = resolveAppVersion(pathname, storedVersion);
  const host = new URL(siteUrl).host;

  const dataHref =
    activeVersion === 'world'
      ? '/world/data'
      : activeVersion === 'dynasty'
        ? '/dynasty/data'
        : '/data';
  const probabilityHref =
    activeVersion === 'world'
      ? '/world/probability'
      : activeVersion === 'dynasty'
        ? '/dynasty/probability'
        : '/probability';
  const aboutHref =
    activeVersion === 'world'
      ? '/world/about'
      : activeVersion === 'dynasty'
        ? '/dynasty/about'
        : '/about';

  const links = [
    { href: aboutHref, label: '关于' },
    { href: probabilityHref, label: '概率计算器' },
    { href: dataHref, label: '数据来源' }
  ];

  return (
    <View as="footer" className="site-footer" paddingBlock={6} gap={3} align="center">
      <nav className="site-footer-nav" aria-label="站点导航">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`site-footer-link ${pathname === link.href ? 'is-active' : ''}`}
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <View direction="row" gap={2} align="center">
        <Text variant="caption-1" color="neutral-faded">
          © 投胎模拟器
        </Text>
        <span className="site-footer-dot" aria-hidden="true">
          ·
        </span>
        <a href={siteUrl} className="site-footer-link site-footer-link--meta">
          {host}
        </a>
      </View>
    </View>
  );
}

export default SiteFooter;
