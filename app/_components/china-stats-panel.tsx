'use client';

import React, { useMemo } from 'react';
import { Text, View } from 'reshaped';
import { useBirth } from '@/lib/store/useBirth';
import { computeChinaPersonalStats } from '@/lib/china-stats';

function ChinaStatsPanel() {
  const birthResults = useBirth(state => state.birthResults);
  const stats = useMemo(
    () => computeChinaPersonalStats(birthResults),
    [birthResults]
  );

  if (stats.total === 0) {
    return null;
  }

  const progress = (stats.uniqueProvinces / stats.totalProvinces) * 100;

  return (
    <View width="100%">
      <View
        backgroundColor="neutral-faded"
        className="rounded-xl"
        padding={4}
        gap={3}
      >
        <View direction="row" justify="space-between" align="center" gap={4}>
          <Text weight="medium">总投胎 {stats.total} 次</Text>
          <Text color="neutral-faded">
            已点亮 {stats.uniqueProvinces}/{stats.totalProvinces} 省
          </Text>
        </View>

        <View className="h-2 bg-[#ebe8e7] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>

        {stats.topProvince && (
          <Text>
            最常出生：
            <Text as="span" weight="medium" color="primary">
              {stats.topProvince}
            </Text>
            （{stats.topProvinceCount} 次，{(stats.topProvinceRate * 100).toFixed(2)}%）
          </Text>
        )}

        <Text color="neutral-faded">
          性别：男孩 {stats.gender.male} / 女孩 {stats.gender.female}
        </Text>

        <Text color="neutral-faded">
          城乡：城市 {stats.category.city} · 城镇 {stats.category.town} · 乡村{' '}
          {stats.category.countryside}
        </Text>
      </View>
    </View>
  );
}

export default ChinaStatsPanel;
