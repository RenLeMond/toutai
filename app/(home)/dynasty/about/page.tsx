import React from 'react';
import { Actionable, Divider, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import Reset from '@/components/reset';
import {
  getDynastyProbabilityExplanation,
  getDynastyProbabilityFormula
} from '@/lib/dynasty-rebirth';

function Page() {
  return (
    <View as="main" paddingInline={4}>
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
          王朝版玩法说明
        </Text>
      </View>
      <View as="article">
        <View paddingBlock={4}>
          <View direction="column" gap={2}>
            <Text variant="body-2">
              如果来世随机投胎到秦至清 13 个历史朝代，你会成为皇室宗亲还是市井小民？
            </Text>
            <Text variant="body-2">
              王朝版按「国祚 × 代表人口」加权抽取朝代，再按各朝 6
              阶社会分层矩阵抽取身份，性别各 50%。概率公式：
            </Text>
            <MathComponent formula={getDynastyProbabilityFormula()} />
            <MathComponent formula={getDynastyProbabilityExplanation()} />
            <Text variant="body-2" color="neutral-faded">
              阶级概率为示意性历史分层，非人口普查数据；分裂政权已合并为三国、晋、南北朝、宋等条目，仅供娱乐体验。
            </Text>
            <Text variant="body-2">
              图鉴共 78 格（13 朝 × 6 阶），未抽中为灰显，点击卡片可翻面查看历世记录。抽中后可分享结果卡海报。
            </Text>
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
                href="/world"
              >
                世界版
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
