import React from 'react';
import { Actionable, Divider, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import Reset from '@/components/reset';

function Page() {
  return (
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
          <View direction="column" gap={2}>
            <Text variant="body-2">
              如果来世随机投胎到世界上，你会出生在哪里？
            </Text>
            <Text variant="body-2">
              世界版根据世界银行 2024
              年全球人口与粗出生率，推算各国出生人口占比，并按大洲汇总。国名可在中文
              / 英文间切换。概率公式：
            </Text>
            <MathComponent formula="\displaystyle{\text{出生在该国家的可能性} = \frac{\text{该国出生人口}}{\text{全球总出生人口}}}" />
            <Text variant="body-2">
              另有
              <Actionable
                className="underline hover:underline hover:text-primary hover:cursor-pointer"
                href="/"
              >
                中国版
              </Actionable>
              与
              <Actionable
                className="underline hover:underline hover:text-primary hover:cursor-pointer"
                href="/dynasty"
              >
                王朝版
              </Actionable>
              ，可在顶部切换。
            </Text>
          </View>
        </View>
        <View paddingBlock={8}>
          <Divider />
        </View>
        <Reset />
      </View>
    </View>
  );
}

export default Page;
