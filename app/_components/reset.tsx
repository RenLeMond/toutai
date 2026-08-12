'use client';

import React from 'react';
import { Button, Text, View } from 'reshaped';
import useResetModal from '@/lib/store/useResetModal';
import { resolveAppVersion, useAppVersion } from '@/lib/store/useAppVersion';
import { usePathname } from 'next/navigation';

function Reset() {
  const pathname = usePathname();
  const storedVersion = useAppVersion(state => state.version);
  const activeVersion = resolveAppVersion(pathname, storedVersion);
  const { activate } = useResetModal();
  const isWorldVersion = activeVersion === 'world';

  return (
    <View direction="row" justify="space-between" paddingBlock={4}>
      <View direction="column">
        <Text variant="body-2">重置数据</Text>
        <Text variant="body-3" color="neutral-faded">
          {isWorldVersion
            ? '此操作将清空世界版投胎记录，不可恢复'
            : '此操作将清空中国版投胎记录，不可恢复'}
        </Text>
      </View>
      <Button color="critical" onClick={activate} variant="faded">
        重置
      </Button>
    </View>
  );
}

export default Reset;
