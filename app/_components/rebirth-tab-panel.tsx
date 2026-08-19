'use client';

import React from 'react';
import { Text, View } from 'reshaped';

interface RebirthTabPanelProps {
  count: number;
  isLoading: boolean;
  children: React.ReactNode;
}

function RebirthTabPanel({ count, isLoading, children }: RebirthTabPanelProps) {
  if (count > 0) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <View
        className="record-card skeleton-state"
        padding={6}
        gap={3}
        attributes={{ role: 'status', 'aria-live': 'polite' }}
      >
        <Text color="neutral-faded" variant="body-3" align="center">
          数据加载中
        </Text>
        <div className="skeleton-stack" aria-hidden="true">
          <span className="skeleton-line" />
          <span className="skeleton-line skeleton-line--short" />
          <span className="skeleton-line skeleton-line--shorter" />
        </div>
      </View>
    );
  }

  return (
    <View className="record-card empty-state-card" align="center" justify="center">
      <div className="empty-state-mark" aria-hidden="true">
        ◎
      </div>
      <Text weight="medium">还没有投胎记录</Text>
      <Text color="neutral-faded" variant="body-3">
        点一次上方按钮，开始你的第一次模拟。
      </Text>
    </View>
  );
}

export default RebirthTabPanel;
