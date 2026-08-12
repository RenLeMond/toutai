import React from 'react';
import { Actionable, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import worldMeta from '@/data/world_meta.json';

function Page() {
  return (
    <View as="main">
      <View paddingBottom={12} paddingTop={24} as="header">
        <Text weight="medium" variant="featured-3" as="h1">
          数据来源
        </Text>
        <Text variant="body-2" color="neutral-faded" as="h2">
          {worldMeta.note}
        </Text>
      </View>
      <View as="article" gap={4}>
        <Text variant="body-2">
          世界版使用
          <Actionable
            className="underline hover:underline hover:text-primary hover:cursor-pointer"
            href="https://data.worldbank.org/"
          >
            世界银行
          </Actionable>
          公布的 {worldMeta.dataYear} 年全球人口与粗出生率统计，推算各国出生人口占比。
        </Text>
        <Text variant="body-2">出生概率计算公式：</Text>
        <MathComponent formula="\displaystyle{\text{出生在该国家的可能性} = \frac{\text{该国出生人口}}{\text{全球总出生人口}}}" />
        <Text variant="body-3" color="neutral-faded">
          原始数据与处理脚本见项目内 scripts/world-data/ 目录。
        </Text>
      </View>
    </View>
  );
}

export default Page;
