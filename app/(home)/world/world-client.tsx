'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, Icon, Loader, Tabs, Text, View } from 'reshaped';
import { toast } from 'sonner';
import { Share2, X } from 'lucide-react';
import {
  formatWorldProbability,
  simulateWorldBirth,
  WorldBirthResult
} from '@/lib/world-rebirth';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import {
  formatCountryName,
  useWorldLocale
} from '@/lib/store/useWorldLocale';
import useShareModal from '@/lib/store/useShareModal';
import ContinentStats from '@/components/continent-stats';
import WorldResultTable from '@/components/world-result-table';
import WorldContinentBar from '@/components/world-continent-bar';
import WorldFirstTimeTable from '@/components/world-first-time-table';
import WorldNameLangSwitch from '@/components/world-name-lang-switch';
import Ads from '@/components/ads';
import worldMeta from '@/data/world_meta.json';

const WorldMap = dynamic(() => import('@/components/world-map'), {
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

function WorldClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPressing, setIsPressing] = useState(false);
  const pressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchActiveRef = useRef(false);
  const ignoreClickRef = useRef(false);

  const nameLang = useWorldLocale(state => state.nameLang);
  const openShare = useShareModal(state => state.openShare);

  useEffect(() => {
    const rehydrate = async () => {
      await useWorldBirth.persist.rehydrate();
      setIsLoading(false);
    };
    rehydrate();
  }, []);

  const latestResult = useWorldBirth(state =>
    state.birthResults.length > 0
      ? state.birthResults[state.birthResults.length - 1]
      : null
  );
  const birthCount = useWorldBirth(state => state.birthResults.length);
  const addBirthResult = useWorldBirth(state => state.addBirthResult);

  const showRebirthToast = (birthResult: WorldBirthResult, count: number) => {
    const countAtCreation = count;
    const countryLabel = formatCountryName(birthResult, nameLang);

    toast.custom(t => (
      <div className="relative bg-white w-full sm:w-[354px] py-5 pl-3 pr-5 border-neutral-faded border rounded-xl">
        <div className="flex flex-row justify-start space-x-2 items-center">
          <Button
            variant="ghost"
            onClick={() => {
              openShare({
                mode: 'world',
                count: countAtCreation,
                region: countryLabel,
                category: '',
                gender: '',
                order: '',
                probability: birthResult.probability,
                continent: birthResult.continent,
                position: birthResult.position
              });
            }}
          >
            <Icon size={4} color="neutral-faded" svg={<Share2 />} />
          </Button>
          <Text>
            第{' '}
            <span className="font-medium text-primary">{countAtCreation}</span>{' '}
            次投胎，你出生在
            <span className="font-medium text-primary">{countryLabel}</span>
            （
            <span className="font-medium text-primary">
              {birthResult.continent}
            </span>
            ），概率{' '}
            <span className="font-medium text-primary">
              {formatWorldProbability(birthResult.probability)}
            </span>
            。
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
  };

  const handleRebirth = () => {
    if (isLoading) return;

    const birthResult = simulateWorldBirth();
    addBirthResult(birthResult);
    showRebirthToast(
      birthResult,
      useWorldBirth.getState().getBirthResultsCount()
    );
  };

  const clearPressInterval = () => {
    if (pressIntervalRef.current) {
      clearInterval(pressIntervalRef.current);
      pressIntervalRef.current = null;
    }
  };

  const startPress = () => {
    if (pressIntervalRef.current) return;
    ignoreClickRef.current = false;
    setIsPressing(true);
    pressIntervalRef.current = setInterval(() => {
      ignoreClickRef.current = true;
      handleRebirth();
    }, 400);
  };

  const endPress = () => {
    setIsPressing(false);
    clearPressInterval();
  };

  useEffect(() => {
    return () => {
      clearPressInterval();
    };
  }, []);

  const handleClickRebirth = () => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    handleRebirth();
  };

  const renderTabPanel = (component: React.ReactNode) => {
    return birthCount > 0 ? (
      component
    ) : (
      <>
        {isLoading ? (
          <View
            direction="row"
            gap={2}
            align="center"
            paddingBlock={4}
            height={64}
            justify="center"
          >
            <Loader />
            <Text>数据加载中</Text>
          </View>
        ) : (
          <View align="center" paddingBlock={4} height={64} justify="center">
            <Text color="neutral">暂无投胎记录，点击投胎按钮开始！</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <View paddingInline={4} paddingBottom={9} className="select-none">
        <View paddingBlock={2} direction="row" justify="space-between" align="center">
          <Text variant="caption-1" color="neutral-faded">
            {worldMeta.note}
          </Text>
          <WorldNameLangSwitch />
        </View>
        <View paddingBlock={4}>
          <WorldMap latestResult={latestResult} rapidMode={isPressing} />
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
              <div
                onMouseDown={event => {
                  if (touchActiveRef.current) return;
                  if (event.button === 0) {
                    startPress();
                  }
                }}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={() => {
                  touchActiveRef.current = true;
                  startPress();
                }}
                onTouchEnd={() => {
                  endPress();
                  window.setTimeout(() => {
                    touchActiveRef.current = false;
                  }, 400);
                }}
                onTouchCancel={() => {
                  endPress();
                  touchActiveRef.current = false;
                }}
              >
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

          {birthCount > 0 && (
            <View width="100%" paddingBlock={2}>
              <ContinentStats />
            </View>
          )}

          <View width="100%" paddingBottom={2} paddingTop={4}>
            <Divider />
          </View>
          <View width="100%" paddingBlock={2}>
            <Tabs variant="pills" defaultValue="record">
              <View paddingBottom={3}>
                <Tabs.List>
                  <Tabs.Item value="record">投胎记录</Tabs.Item>
                  <Tabs.Item value="continent">大洲分布</Tabs.Item>
                  <Tabs.Item value="first">第一次出现</Tabs.Item>
                </Tabs.List>
              </View>
              <Tabs.Panel value="record">
                {renderTabPanel(<WorldResultTable />)}
              </Tabs.Panel>
              <Tabs.Panel value="continent">
                {renderTabPanel(<WorldContinentBar />)}
              </Tabs.Panel>
              <Tabs.Panel value="first">
                {renderTabPanel(<WorldFirstTimeTable />)}
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

export default WorldClient;
