'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppVersion,
  resolveAppVersion,
  useAppVersion
} from '@/lib/store/useAppVersion';
import { SegmentSwitch } from '@/components/segment-switch';

const VERSION_OPTIONS = [
  { value: 'china' as const, label: '中国' },
  { value: 'world' as const, label: '世界' },
  { value: 'dynasty' as const, label: '王朝' }
];

function VersionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const version = useAppVersion(state => state.version);
  const setVersion = useAppVersion(state => state.setVersion);
  const activeVersion = resolveAppVersion(pathname, version);

  const handleSwitch = (nextVersion: AppVersion) => {
    if (nextVersion === activeVersion) return;
    setVersion(nextVersion);
    if (nextVersion === 'world') {
      router.push('/world');
    } else if (nextVersion === 'dynasty') {
      router.push('/dynasty');
    } else {
      router.push('/');
    }
  };

  return (
    <SegmentSwitch
      value={activeVersion}
      options={VERSION_OPTIONS}
      onChange={handleSwitch}
      ariaLabel="版本切换"
      size="sm"
    />
  );
}

export default VersionSwitcher;
