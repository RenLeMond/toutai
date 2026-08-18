import { useLayoutEffect, useRef, useState } from 'react';
import { HEAT_FLUSH_INTERVAL } from '@/lib/map-config';

export function shouldFlushHeatData(
  rapidMode: boolean,
  wasRapid: boolean,
  resultCount: number,
  flushedLength: number
): boolean {
  return (
    !rapidMode ||
    !wasRapid ||
    resultCount - flushedLength >= HEAT_FLUSH_INTERVAL
  );
}

export function useThrottledHeatData<T>(
  dataList: T[],
  resultCount: number,
  rapidMode: boolean
): T[] {
  const [displayData, setDisplayData] = useState(dataList);
  const syncRef = useRef({
    rapidMode,
    resultCount,
    dataList,
    flushedLength: resultCount
  });

  useLayoutEffect(() => {
    const sync = syncRef.current;
    const wasRapid = sync.rapidMode;
    const shouldFlush = shouldFlushHeatData(
      rapidMode,
      wasRapid,
      resultCount,
      sync.flushedLength
    );

    if (
      rapidMode === sync.rapidMode &&
      resultCount === sync.resultCount &&
      dataList === sync.dataList
    ) {
      return;
    }

    syncRef.current = {
      rapidMode,
      resultCount,
      dataList,
      flushedLength: shouldFlush ? resultCount : sync.flushedLength
    };

    if (shouldFlush) {
      setDisplayData(dataList);
    }
  }, [rapidMode, resultCount, dataList]);

  return displayData;
}
