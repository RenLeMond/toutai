import React from 'react';
import { Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  dynasties,
  formatDynastyProbability,
  formatDynastyYear
} from '@/lib/dynasty-rebirth';

function Page() {
  return (
    <View as="main" paddingInline={4} paddingBottom={12}>
      <View paddingBottom={12} paddingTop={24} as="header">
        <Text weight="medium" variant="featured-3" as="h1">
          数据来源
        </Text>
        <Text variant="body-2" color="neutral-faded" as="h2">
          朝代与阶级设定说明
        </Text>
      </View>
      <View as="article" gap={4}>
        <Text variant="body-2">
          王朝版包含 13 个历史朝代，每朝 6 个代表性社会阶级。朝代抽取按
          「国祚 × 代表人口」加权；阶级在各朝内部按示意矩阵抽取。
        </Text>
        <Text variant="body-2" color="neutral-faded">
          重要说明：阶级概率为示意性历史社会分层模型，并非基于人口普查或学术统计。三国、晋、南北朝与两宋均已合并为统一条目，仅供娱乐体验。
        </Text>
        <View gap={3}>
          {dynasties.map(d => (
            <View key={d.id} gap={1}>
              <Text variant="body-2" weight="medium">
                {d.name}（{formatDynastyYear(d.startYear)}–
                {formatDynastyYear(d.endYear)}，国祚 {d.duration} 年，代表人口{' '}
                {d.popWan} 万，权重占比{' '}
                {formatDynastyProbability(d.dynastyProb)}）
              </Text>
              {d.classes.map(c => (
                <Text key={c.id} variant="body-3" color="neutral-faded">
                  · L{c.level} {CLASS_STAMPS[c.level as keyof typeof CLASS_STAMPS].name} · {c.name}（权重{' '}
                  {(c.prob * 100).toFixed(1)}%）— {c.desc}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Page;
