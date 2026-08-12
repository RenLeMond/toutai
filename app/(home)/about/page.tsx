import React from 'react';
import { Actionable, Divider, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import Reset from '@/components/reset';

function Page() {
  return (
    <>
      <View as="main">
        <View
          paddingBottom={12}
          paddingTop={24}
          width={{ s: '100%', m: 130 }}
          as="header"
        >
          <Text weight="medium" variant="featured-3" as="h1">
            关于
          </Text>
          <Text variant="body-2" color="neutral-faded" as="h2">
            关于本网站
          </Text>
        </View>
        <View as="article">
          <View paddingBlock={4}>
            <View direction="column" gap={4}>
              <View direction="column" gap={2}>
                <Text variant="body-2" weight="medium">
                  中国版
                </Text>
                <Text variant="body-2">
                  如果来世还在种花家，你会出生在哪里？
                </Text>
                <Text variant="body-2">
                  中国版根据全国公布的最新出生人口数据，计算出生在某地区的可能性，使用了以下公式：
                </Text>
                <MathComponent formula="\displaystyle{\text{出生在该地区的可能性} = \frac{\text{该地区出生人口}}{\text{全国总出生人口}}}" />
              </View>
              <View direction="column" gap={2}>
                <Text variant="body-2" weight="medium">
                  世界版
                </Text>
                <Text variant="body-2">
                  如果来世随机投胎到世界上，你会出生在哪里？
                </Text>
                <Text variant="body-2">
                  世界版根据世界银行公布的全球出生人口数据，计算出生在某国家的可能性，使用了以下公式：
                </Text>
                <MathComponent formula="\displaystyle{\text{出生在该国家的可能性} = \frac{\text{该国出生人口}}{\text{全球总出生人口}}}" />
              </View>
              <Text variant="body-2">
                参考项目：
                <Actionable
                  className="underline hover:underline hover:text-primary hover:cursor-pointer"
                  href="https://uahh.site/reborn"
                >
                  https://uahh.site/reborn
                </Actionable>
              </Text>
            </View>
          </View>
          <View paddingBlock={8}>
            <Divider />
          </View>
          <Reset />
        </View>
      </View>
    </>
  );
}

export default Page;
