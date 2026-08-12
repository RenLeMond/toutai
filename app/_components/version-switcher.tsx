'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Text, View } from 'reshaped';
import {
  AppVersion,
  resolveAppVersion,
  useAppVersion
} from '@/lib/store/useAppVersion';

function VersionBadge({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-2 py-1 rounded-xl transition-colors ${
        active
          ? 'bg-[#01ca78] hover:cursor-default'
          : 'bg-[#e8e6e1] hover:bg-[#dedbd4] hover:cursor-pointer'
      }`}
    >
      <Text
        className={active ? 'text-white' : 'text-[#4a4a4a]'}
        weight="medium"
        variant="caption-1"
      >
        {label}
      </Text>
    </button>
  );
}

function VersionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const version = useAppVersion(state => state.version);
  const setVersion = useAppVersion(state => state.setVersion);
  const activeVersion = resolveAppVersion(pathname, version);

  const handleSwitch = (nextVersion: AppVersion) => {
    if (nextVersion === activeVersion) return;
    setVersion(nextVersion);
    router.push(nextVersion === 'world' ? '/world' : '/');
  };

  return (
    <View direction="row" align="center" gap={1}>
      <VersionBadge
        label="中国版"
        active={activeVersion === 'china'}
        onClick={() => handleSwitch('china')}
      />
      <VersionBadge
        label="世界版"
        active={activeVersion === 'world'}
        onClick={() => handleSwitch('world')}
      />
    </View>
  );
}

export default VersionSwitcher;
