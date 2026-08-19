'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon, Text } from 'reshaped';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
import {
  CLASS_STAMPS,
  DynastyBirthResult,
  formatDynastyProbability,
  getFlavorLine
} from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';
import useShareModal from '@/lib/store/useShareModal';
import { buildDynastyShareInfo } from '@/lib/dynasty-share';
import { DynastyRevealPayload } from '@/components/dynasty-flip-card';
import { RebirthToast } from '@/components/rebirth-toast';

/**
 * Shared hook that encapsulates the full dynasty spin lifecycle:
 * store rehydration, toast notifications, result commit, and spin orchestration.
 *
 * @param simulateFn — the simulation function to call on each spin
 *   (e.g. `simulateDynastyBirth` for weighted, `simulateEqualDynastyBirth` for uniform)
 */
export function useDynastySpinner(simulateFn: () => DynastyBirthResult) {
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
      const flavor = getFlavorLine(
        birthResult.classLevel,
        birthResult.dynastyId
      );

      toast.custom(t => (
        <RebirthToast toastId={t}>
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
              <span className="font-medium text-primary tabular-nums">
                {countAtCreation}
              </span>{' '}
              次投胎，你生于
              <span className="font-medium text-primary">
                {birthResult.dynastyName}
              </span>
              ，身为
              <span className="font-medium text-primary">
                {birthResult.className}
              </span>
              （{stamp}），概率{' '}
              <span className="font-medium text-primary tabular-nums">
                {formatDynastyProbability(birthResult.probability)}
              </span>
              。{flavor}
            </Text>
          </div>
        </RebirthToast>
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

    const birthResult = simulateFn();
    const existing = useDynastyBirth.getState().birthResults;
    const isNew = !existing.some(
      r =>
        r.dynastyId === birthResult.dynastyId &&
        r.classLevel === birthResult.classLevel
    );

    pendingResultRef.current = birthResult;
    spinningRef.current = true;
    setIsSpinning(true);
    revealSeqRef.current += 1;
    setReveal({
      seq: revealSeqRef.current,
      result: birthResult,
      isNew
    });
  }, [isLoading, simulateFn]);

  return {
    isLoading,
    isSpinning,
    reveal,
    latestResult,
    birthCount,
    startSpin,
    handleRevealComplete
  };
}
