'use client';

import React from 'react';
import { Button, Dismissible, Modal, Text, View } from 'reshaped';
import useResetModal from '@/lib/store/useResetModal';
import { useBirth } from '@/lib/store/useBirth';
import { resolveAppVersion, useAppVersion } from '@/lib/store/useAppVersion';
import { usePathname } from 'next/navigation';

function ResetModal() {
  const pathname = usePathname();
  const storedVersion = useAppVersion(state => state.version);
  const activeVersion = resolveAppVersion(pathname, storedVersion);
  const { active, deactivate } = useResetModal();
  const clearChinaBirthResults = useBirth(state => state.clearBirthResults);
  const isWorldVersion = activeVersion === 'world';
  const isDynastyVersion = activeVersion === 'dynasty';

  async function handleReset() {
    if (isWorldVersion) {
      const { useWorldBirth } = await import('@/lib/store/useWorldBirth');
      useWorldBirth.getState().clearBirthResults();
    } else if (isDynastyVersion) {
      const { useDynastyBirth } = await import('@/lib/store/useDynastyBirth');
      useDynastyBirth.getState().clearBirthResults();
    } else {
      clearChinaBirthResults();
    }
    deactivate();
  }

  return (
    <Modal active={active} onClose={deactivate}>
      <View gap={3}>
        <Dismissible
          key="header"
          onClose={deactivate}
          closeAriaLabel="Close modal"
        >
          <Modal.Title>确定要重置数据？</Modal.Title>
          <Modal.Subtitle>
            {isWorldVersion
              ? '此操作将清空世界版投胎记录，不可恢复'
              : isDynastyVersion
                ? '此操作将清空王朝版投胎记录与图鉴，不可恢复'
                : '此操作将清空中国版投胎记录，不可恢复'}
          </Modal.Subtitle>
        </Dismissible>
        <View key="actions" gap={2} direction="row">
          <View.Item key="cancel" columns={6}>
            <Button
              color="neutral"
              variant="faded"
              fullWidth
              onClick={deactivate}
            >
              取消
            </Button>
          </View.Item>
          <View.Item key="reset" columns={6}>
            <Button
              color="critical"
              variant="faded"
              fullWidth
              onClick={handleReset}
            >
              重置
            </Button>
          </View.Item>
        </View>
      </View>
    </Modal>
  );
}

export default ResetModal;
