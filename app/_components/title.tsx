'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text, View } from 'reshaped';
import { resolveAppVersion, useAppVersion } from '@/lib/store/useAppVersion';
import VersionSwitcher from '@/components/version-switcher';
import { siteIconSmall } from '@/lib/site';

export function CarrotIcon({ size = 28 }: { size?: number }) {
  return (
    <img
      src={siteIconSmall}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="shrink-0"
      loading="eager"
      decoding="async"
    />
  );
}

function Title() {
  const pathname = usePathname();
  const version = useAppVersion(state => state.version);
  const activeVersion = resolveAppVersion(pathname, version);
  const homeHref = activeVersion === 'world' ? '/world' : '/';

  return (
    <View direction="row" align="center" gap={2}>
      <Link href={homeHref}>
        <View direction="row" align="center" gap={2}>
          <CarrotIcon />
          <Text variant="body-1" weight="medium">
            投胎模拟器
          </Text>
        </View>
      </Link>
      <VersionSwitcher />
    </View>
  );
}

export default Title;
