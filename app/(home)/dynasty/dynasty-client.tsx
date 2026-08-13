'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Divider, Icon, Loader, Tabs, Text, View } from 'reshaped';
import { toast } from 'sonner';
import { Share2, X } from 'lucide-react';
import {
  CLASS_STAMPS,
  DynastyBirthResult,
  formatDynastyProbability,
  getFlavorLine,
  simulateDynastyBirth
} from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';
import useShareModal from '@/lib/store/useShareModal';
import { buildDynastyShareInfo } from '@/lib/dynasty-share';
import Ads from '@/components/ads';
import RebirthTabPanel from '@/components/rebirth-tab-panel';
import DynastyFlipCard, { DynastyRevealPayload } from '@/components/dynasty-flip-card';
import DynastyResultTable from '@/components/dynasty-result-table';
import DynastyBar from '@/components/dynasty-bar';
import DynastyAtlas from '@/components/dynasty-atlas';

function DynastyClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reveal, setReveal] = useState<DynastyRevealPayload | null>(null);
  const revealSeqRef = useRef(0);
  const spinningRef = useRef(false);
  const pendingResultRef = useRef<DynastyBirthResult | null>(null);

  const openShare = useShareModal(state => state.openShare);

  useEffect(() => {
    const rehydrate = async () => {
      await useDynastyBirth.persist.rehydrate();
      setIsLoading(false);
    };
    rehydrate();
  }, []);

  const latestResult = useDynastyBirth(state =>
    state.birthResults.length > 0
      ? state.birthResults[state.birthResults.length - 1]
      : null
  );
  const birthCount = useDynastyBirth(state => state.birthResults.length);
  const addBirthResult = useDynastyBirth(state => state.addBirthResult);
  const consumeTrimNotice = useDynastyBirth(state => state.consumeTrimNotice);
  const getBirthResultsCount = useDynastyBirth(
    state => state.getBirthResultsCount
  );

  const showRebirthToast = useCallback(
    (birthResult: DynastyBirthResult, count: number) => {
      const countAtCreation = count;
      const stamp = CLASS_STAMPS[birthResult.classLevel].name;
      const flavor = getFlavorLine(birthResult.classLevel);

      toast.custom(t => (
        <div className="relative bg-white w-full sm:w-[354px] py-5 pl-3 pr-5 border-neutral-faded border rounded-xl">
          <div className="flex flex-row justify-start space-x-2 items-center">
            <Button
              variant="ghost"
              onClick={() => {
                openShare(
                  buildDynastyShareInfo(birthResult, countAtCreation, flavor)
                );
              }}
            >
              <Icon size={4} color="neutral-faded" svg={<Share2 />} />
            </Button>
            <Text>
              第{' '}
              <span className="font-medium text-primary">{countAtCreation}</span>{' '}
              次投胎，你生于
              <span className="font-medium text-primary">
                {birthResult.dynastyName}
              </span>
              ，身为
              <span className="font-medium text-primary">
                {birthResult.className}
              </span>
              （{stamp}），概率{' '}
              <span className="font-medium text-primary">
                {formatDynastyProbability(birthResult.probability)}
              </span>
              。{flavor}
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

  const committersRef = useRef({
    addBirthResult,
    consumeTrimNotice,
    getBirthResultsCount,
    showRebirthToast
  });

  useEffect(() => {
    committersRef.current = {
      addBirthResult,
      consumeTrimNotice,
      getBirthResultsCount,
      showRebirthToast
    };
  });

  const commitPendingResult = useCallback((notify: boolean) => {
    const birthResult = pendingResultRef.current;
    if (!birthResult) return;

    pendingResultRef.current = null;
    const {
      addBirthResult: add,
      consumeTrimNotice: consume,
      getBirthResultsCount: countOf,
      showRebirthToast: showToast
    } = committersRef.current;

    add(birthResult);

    if (!notify) {
      consume();
      return;
    }

    if (consume()) {
      toast.message('历史记录已达上限，最早记录已自动清理');
    }

    showToast(birthResult, countOf());
  }, []);

  useEffect(() => {
    return () => {
      commitPendingResult(false);
    };
  }, [commitPendingResult]);

  const handleRevealComplete = useCallback(
    (_result: DynastyBirthResult, seq: number) => {
      if (seq !== revealSeqRef.current) return;
      commitPendingResult(true);
      spinningRef.current = false;
      setIsSpinning(false);
    },
    [commitPendingResult]
  );

  const startSpin = useCallback(() => {
    if (isLoading || spinningRef.current) return;

    const birthResult = simulateDynastyBirth();
    pendingResultRef.current = birthResult;
    spinningRef.current = true;
    setIsSpinning(true);
    revealSeqRef.current += 1;
    setReveal({
      seq: revealSeqRef.current,
      result: birthResult
    });
  }, [isLoading]);

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

          <View width="100%" paddingBottom={2} paddingTop={4}>
            <Divider />
          </View>
          <View width="100%" paddingBlock={2}>
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

export default DynastyClient;
