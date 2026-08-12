import React from 'react';
import { Text, View } from 'reshaped';
import WorldCalculator from '@/components/world-calculator';

function Page() {
  return (
    <View as="main" paddingInline={4} paddingBottom={12}>
      <View paddingBottom={12} paddingTop={24} as="header">
        <Text weight="medium" variant="featured-3" as="h1">
          概率计算器
        </Text>
        <Text variant="body-2" color="neutral-faded" as="h2">
          计算你出生在指定国家的概率
        </Text>
      </View>
      <WorldCalculator />
    </View>
  );
}

export default Page;
