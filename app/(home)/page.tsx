import React from 'react';
import { Text, View } from 'reshaped';
import HomeClient from './home-client';

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
          投胎模拟器中国版
        </Text>
        <Text as="p" variant="caption-1" color="neutral-faded">
          投胎模拟器根据全国出生人口数据，模拟你在中国的出生省份、性别与家庭排行。点击地图上的「投胎」按钮，看看你会出生在哪里。
        </Text>
      </View>
      <HomeClient />
    </>
  );
}

export default Page;
