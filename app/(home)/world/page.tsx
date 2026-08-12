import React from 'react';
import { Text, View } from 'reshaped';
import WorldClient from './world-client';

function Page() {
  return (
    <>
      <View
        as="section"
        paddingInline={4}
        paddingTop={2}
        paddingBottom={2}
        attributes={{ 'aria-label': '网站介绍' }}
      >
        <Text
          as="h1"
          variant="body-2"
          color="neutral-faded"
          className="sr-only"
        >
          投胎模拟器世界版
        </Text>
        <Text as="p" variant="caption-1" color="neutral-faded">
          投胎模拟器世界版根据世界银行公布的全球出生人口数据，模拟你在世界上的出生国家。点击地图上的「投胎」按钮，看看你会出生在哪里。
        </Text>
      </View>
      <WorldClient />
    </>
  );
}

export default Page;
