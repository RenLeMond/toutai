'use client';

import React, { useMemo } from 'react';
import { Text, useResponsiveClientValue, View } from 'reshaped';
import { CLASS_STAMPS } from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';

interface BarItem {
  label: string;
  probability: number;
  count: number;
}

function DynastyBar({ field }: { field: 'dynastyName' | 'classLevel' }) {
  const percentage = useResponsiveClientValue({ s: 56, l: 70 });
  const birthResults = useDynastyBirth(state => state.birthResults);

  const sortedResults: BarItem[] = useMemo(() => {
    const counts: Record<string, number> = {};
    birthResults.forEach(r => {
      const key =
        field === 'dynastyName'
          ? r.dynastyName
          : String(r.classLevel);
      counts[key] = (counts[key] ?? 0) + 1;
    });

    const total = birthResults.length || 1;
    const labelMap: Record<string, string> = Object.fromEntries(
      Object.entries(CLASS_STAMPS).map(([level, stamp]) => [level, stamp.name])
    );

    return Object.entries(counts)
      .map(([key, count]) => ({
        label: field === 'classLevel' ? (labelMap[key] ?? key) : key,
        count,
        probability: count / total
      }))
      .sort((a, b) => b.probability - a.probability);
  }, [birthResults, field]);

  const maxProbability =
    sortedResults.length > 0 ? sortedResults[0].probability : 0;

  return (
    <View direction="column" gap={1}>
      {sortedResults.map(item => {
        const barWidth =
          percentage !== undefined && maxProbability > 0
            ? (item.probability / maxProbability) * percentage
            : 0;

        return (
          <View key={item.label} direction="row" align="center" gap={2}>
            <View key={`${item.label}-name`} width={14} className="shrink-0">
              <Text variant="body-3">{item.label}</Text>
            </View>
            <View.Item key={`${item.label}-bar`} grow>
              <div
                className="bg-[#ebe8e7] h-8 rounded-xl"
                style={{ width: `${barWidth}%` }}
              />
            </View.Item>
            <View key={`${item.label}-pct`} width={14} align="end" className="shrink-0">
              <Text variant="body-3" color="neutral-faded">
                {(item.probability * 100).toFixed(2)}%
              </Text>
            </View>
            <View key={`${item.label}-count`} width={6} align="end" className="shrink-0">
              <Text variant="body-3" color="neutral-faded">
                {item.count}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default DynastyBar;
