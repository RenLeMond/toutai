import React from 'react';
import { Text, View } from 'reshaped';
import DynastyCalculator from '@/components/dynasty-calculator';

function Page() {
  return (
    <View as="main" paddingInline={4} paddingBottom={12}>
      <View paddingBottom={12} paddingTop={24} as="header">
        <Text weight="medium" variant="featured-3" as="h1">
          概率计算器
        </Text>
        <Text variant="body-2" color="neutral-faded" as="h2">
          计算你投胎在指定朝代与阶级的概率
        </Text>
      </View>
      <DynastyCalculator />
    </View>
  );
}

export default Page;
