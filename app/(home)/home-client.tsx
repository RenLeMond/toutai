'use client';

import dynamic from 'next/dynamic';
import { Button, Divider, Icon, Loader, Tabs, Text, View } from 'reshaped';
import React, { useCallback, useEffect, useState } from 'react';
import ResultTable from '@/components/result-table';
import { toast } from 'sonner';
import { Share2, X } from 'lucide-react';
import {
  BirthResult,
  simulateBirth,
  translateGenderChild
} from '@/_lib/rebirth';
import { useBirth } from '@/lib/store/useBirth';
import BarList from '@/components/barlist';
import Piechart from '@/components/piechart';
import FirstTimeTable from '@/components/first-time-table';
import useShareModal from '@/lib/store/useShareModal';
import Ads from '@/components/ads';
import { useRebirthPress } from '@/hooks/useRebirthPress';
import RebirthTabPanel from '@/components/rebirth-tab-panel';
import ChinaStatsPanel from '@/components/china-stats-panel';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <View
      direction="row"
      gap={2}
      align="center"
      justify="center"
      paddingBlock={16}
    >
      <Loader />
      <Text>地图加载中</Text>
    </View>
  )
});

const hasStillbirthOutcome = () => Math.random() < 0.0031;

function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rehydrate = async () => {
      await useBirth.persist.rehydrate();
      setIsLoading(false);
    };
    rehydrate();
  }, []);

  const openShare = useShareModal(state => state.openShare);

  const { addBirthResult, getBirthResultsCount, consumeTrimNotice } = useBirth(
    state => ({
      addBirthResult: state.addBirthResult,
      getBirthResultsCount: state.getBirthResultsCount,
      consumeTrimNotice: state.consumeTrimNotice
    })
  );

  const showRebirthToast = useCallback(
    (birthResult: BirthResult, count: number) => {
      const countAtCreation = count;
      toast.custom(t => (
        <div className="relative bg-white w-full sm:w-[354px] py-5 pl-3 pr-5 border-neutral-faded border rounded-xl">
          <div className="flex flex-row justify-start space-x-2 items-center">
            <Button
              variant="ghost"
              onClick={() => {
                openShare({
                  mode: 'china',
                  count: countAtCreation,
                  region: birthResult.province,
                  category: birthResult.category,
                  gender: birthResult.gender,
                  order: birthResult.order,
                  probability: birthResult.probability
                });
              }}
            >
              <Icon size={4} color="neutral-faded" svg={<Share2 />} />
            </Button>
            <Text>
              第{' '}
              <span className="font-medium text-primary">{countAtCreation}</span>{' '}
              次投胎，
              {['香港', '澳门', '台湾'].includes(birthResult.province) ? (
                <>
                  你出生在
                  <span className="font-medium text-primary">
                    {birthResult.province}
                  </span>
                  ，是一个
                  <span className="font-medium text-primary">
                    {translateGenderChild(birthResult.gender)}
                  </span>
                  。
                </>
              ) : (
                <>
                  你出生在
                  <span className="font-medium text-primary">
                    {birthResult.province}
                  </span>
                  的
                  <span className="font-medium text-primary">
                    {birthResult.category}
                  </span>
                  ，是一个
                  <span className="font-medium text-primary">
                    {translateGenderChild(birthResult.gender)}
                  </span>
                  ，你是这个家庭
                  <span className="font-medium text-primary">
                    第{birthResult.order}个
                  </span>
                  孩子。
                </>
              )}
            </Text>
          </div>

          <button
            className="absolute top-2 right-3"
            onClick={() => toast.dismiss(t)}
          >
            <Icon size={4} color="neutral-faded" svg={<X />} />
          </button>
        </div>
      ));
    },
    [openShare]
  );

  const showRebirthErrorToast = useCallback(() => {
    toast.custom(t => (
      <div className="relative bg-red-100 w-full sm:w-[354px] p-5 border-red-500 border rounded-xl">
        <div className="flex flex-row justify-between">
          <Text color="critical">
            抱歉，你在这次投胎中不幸夭折，再试一次吧！
          </Text>
        </div>
        <button
          className="absolute top-2 right-3"
          onClick={() => toast.dismiss(t)}
        >
          <Icon color="critical" size={4} svg={<X />} />
        </button>
      </div>
    ));
  }, []);

  const handleRebirth = useCallback(() => {
    if (hasStillbirthOutcome()) {
      showRebirthErrorToast();
      return;
    }

    const birthResult = simulateBirth();
    addBirthResult(birthResult);

    if (consumeTrimNotice()) {
      toast.message('历史记录已达上限，最早记录已自动清理');
    }

    showRebirthToast(birthResult, getBirthResultsCount());
  }, [
    addBirthResult,
    consumeTrimNotice,
    getBirthResultsCount,
    showRebirthErrorToast,
    showRebirthToast
  ]);

  const { pressHandlers, handleClickRebirth } = useRebirthPress({
    interval: 150,
    onRebirth: handleRebirth,
    disabled: isLoading
  });

  const birthCount = getBirthResultsCount();

  return (
    <>
      <View paddingInline={4} paddingBottom={9} className="select-none">
        <View paddingBlock={4}>
          <Map />
        </View>
        <View align="center">
          <View
            direction="row"
            justify="center"
            paddingBlock={4}
            gap={4}
            position="relative"
            width="100%"
          >
            <View width={64}>
              <div {...pressHandlers}>
                <Button
                  color="primary"
                  rounded
                  fullWidth
                  disabled={isLoading}
                  onClick={handleClickRebirth}
                >
                  投胎
                </Button>
              </div>
            </View>
          </View>

          <View width="100%" paddingBottom={2} paddingTop={4}>
            <Divider />
          </View>
          <View width="100%" paddingBlock={2}>
            <Tabs variant="pills" defaultValue="record">
              <View paddingBottom={3}>
                <Tabs.List>
                  <Tabs.Item value="record">投胎记录</Tabs.Item>
                  <Tabs.Item value="province">地区分布</Tabs.Item>
                  <Tabs.Item value="gender">性别分布</Tabs.Item>
                  <Tabs.Item value="first">第一次出现</Tabs.Item>
                  <Tabs.Item value="stats">个人统计</Tabs.Item>
                </Tabs.List>
              </View>
              <Tabs.Panel value="record">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <ResultTable />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="province">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <BarList />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="gender">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <Piechart />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="first">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <FirstTimeTable />
                </RebirthTabPanel>
              </Tabs.Panel>
              <Tabs.Panel value="stats">
                <RebirthTabPanel count={birthCount} isLoading={isLoading}>
                  <ChinaStatsPanel />
                </RebirthTabPanel>
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

export default HomeClient;
