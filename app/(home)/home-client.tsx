'use client';

import dynamic from 'next/dynamic';
import { Button, Icon, Tabs, Text, View } from 'reshaped';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResultTable from '@/components/result-table';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
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
import { MapStageSkeleton } from '@/components/map-stage-skeleton';
import { RebirthToast } from '@/components/rebirth-toast';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <MapStageSkeleton />
});

const hasStillbirthOutcome = () => Math.random() < 0.0031;

function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const trimPendingRef = useRef(false);

  useEffect(() => {
    const rehydrate = async () => {
      await useBirth.persist.rehydrate();
      setIsLoading(false);
    };
    rehydrate();
  }, []);

  const openShare = useShareModal(state => state.openShare);

  const addBirthResult = useBirth(state => state.addBirthResult);
  const consumeTrimNotice = useBirth(state => state.consumeTrimNotice);
  const birthCount = useBirth(state => state.birthResults.length);

  const showRebirthToast = useCallback(
    (birthResult: BirthResult, count: number) => {
      const countAtCreation = count;
      toast.custom(t => (
        <RebirthToast toastId={t}>
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
              <span className="font-medium text-primary tabular-nums">
                {countAtCreation}
              </span>{' '}
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
                  <span className="font-medium text-primary tabular-nums">
                    第{birthResult.order}个
                  </span>
                  孩子。
                </>
              )}
            </Text>
          </div>
        </RebirthToast>
      ));
    },
    [openShare]
  );

  const showRebirthErrorToast = useCallback(() => {
    toast.custom(t => (
      <RebirthToast toastId={t} tone="critical">
        <Text color="critical">这次投胎未能降生，再试一次。</Text>
      </RebirthToast>
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

    showRebirthToast(birthResult, useBirth.getState().birthResults.length);
  }, [
    addBirthResult,
    consumeTrimNotice,
    showRebirthErrorToast,
    showRebirthToast
  ]);

  const handleHoldRebirth = useCallback(() => {
    if (hasStillbirthOutcome()) {
      return;
    }

    const birthResult = simulateBirth();
    addBirthResult(birthResult);

    if (consumeTrimNotice()) {
      trimPendingRef.current = true;
    }
  }, [addBirthResult, consumeTrimNotice]);

  const handlePressEnd = useCallback(() => {
    if (trimPendingRef.current) {
      trimPendingRef.current = false;
      toast.message('历史记录已达上限，最早记录已自动清理');
    }
  }, []);

  const { isPressing, pressHandlers, handleClickRebirth } = useRebirthPress({
    interval: 400,
    onRebirth: handleRebirth,
    onHoldRebirth: handleHoldRebirth,
    onPressEnd: handlePressEnd,
    disabled: isLoading
  });

  return (
    <>
      <View paddingInline={4} paddingBottom={9} className="select-none">
        <View paddingBlock={4}>
          <Map rapidMode={isPressing} />
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

          <View width="100%" paddingTop={4}>
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
