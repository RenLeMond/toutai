'use client';

import React from 'react';
import { Loader, Text, View } from 'reshaped';

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
        direction="row"
        gap={2}
        align="center"
        paddingBlock={4}
        height={64}
        justify="center"
      >
        <Loader />
        <Text>数据加载中</Text>
      </View>
    );
  }

  return (
    <View align="center" paddingBlock={4} height={64} justify="center">
      <Text color="neutral">暂无投胎记录，点击投胎按钮开始！</Text>
    </View>
  );
}

export default RebirthTabPanel;
