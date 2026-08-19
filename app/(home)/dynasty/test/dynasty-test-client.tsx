'use client';

import React from 'react';
import { Button, Loader, Tabs, Text, View } from 'reshaped';
import { simulateEqualDynastyBirth } from '@/lib/dynasty-rebirth';
import { useDynastySpinner } from '@/lib/hooks/useDynastySpinner';
import Ads from '@/components/ads';
import RebirthTabPanel from '@/components/rebirth-tab-panel';
import DynastyFlipCard from '@/components/dynasty-flip-card';
import DynastyResultTable from '@/components/dynasty-result-table';
import DynastyBar from '@/components/dynasty-bar';
import DynastyAtlas from '@/components/dynasty-atlas';

function DynastyTestClient() {
  const {
    isLoading,
    isSpinning,
    reveal,
    latestResult,
    birthCount,
    startSpin,
    handleRevealComplete
  } = useDynastySpinner(simulateEqualDynastyBirth);

  if (isLoading) {
    return (
      <View
        direction="row"
        gap={2}
        align="center"
        justify="center"
        paddingBlock={16}
      >
        <Loader />
        <Text>加载中</Text>
      </View>
    );
  }

  return (
    <>
      <View paddingBottom={9} className="select-none">
        <View paddingBlock={4}>
          <DynastyFlipCard
            result={latestResult}
            reveal={reveal}
            disabled={isSpinning}
            onClick={startSpin}
            onRevealComplete={handleRevealComplete}
          />
        </View>
        <View align="center" paddingInline={4}>
          <View
            direction="row"
            justify="center"
            paddingBlock={4}
            gap={4}
            position="relative"
            width="100%"
          >
            <View width={64}>
              <Button
                color="primary"
                rounded
                fullWidth
                disabled={isLoading || isSpinning}
                onClick={startSpin}
              >
                投胎
              </Button>
            </View>
          </View>

          <View width="100%" paddingTop={4}>
            <Tabs variant="pills" defaultValue="record">
              <View paddingBottom={3}>
                <Tabs.List>
                  <Tabs.Item value="record">投胎记录</Tabs.Item>
                  <Tabs.Item value="dynasty">朝代分布</Tabs.Item>
                  <Tabs.Item value="class">阶级分布</Tabs.Item>
                  <Tabs.Item value="atlas">图鉴</Tabs.Item>
                </Tabs.List>
              </View>
              <Tabs.Panel value="record">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <DynastyResultTable />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="dynasty">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <DynastyBar field="dynastyName" />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="class">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <DynastyBar field="classLevel" />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="atlas">
                <DynastyAtlas />
              </Tabs.Panel>
            </Tabs>
          </View>
        </View>
      </View>
      <View paddingBottom={4} paddingInline={4}>
        <Ads />
      </View>
    </>
  );
}

export default DynastyTestClient;
