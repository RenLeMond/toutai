import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

interface UseRebirthPressOptions {
  interval: number;
  onRebirth: () => void;
  onHoldRebirth?: () => void;
  disabled?: boolean;
}

export function useRebirthPress({
  interval,
  onRebirth,
  onHoldRebirth,
  disabled = false
}: UseRebirthPressOptions) {
  const [isPressing, setIsPressing] = useState(false);
  const pressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchActiveRef = useRef(false);
  const ignoreClickRef = useRef(false);
  const onRebirthRef = useRef(onRebirth);
  const onHoldRebirthRef = useRef(onHoldRebirth);

  useEffect(() => {
    onRebirthRef.current = onRebirth;
  }, [onRebirth]);

  useEffect(() => {
    onHoldRebirthRef.current = onHoldRebirth;
  }, [onHoldRebirth]);

  const clearPressInterval = useCallback(() => {
    if (pressIntervalRef.current) {
      clearInterval(pressIntervalRef.current);
      pressIntervalRef.current = null;
    }
  }, []);

  const startPress = useCallback(() => {
    if (disabled || pressIntervalRef.current) return;

    ignoreClickRef.current = false;
    setIsPressing(true);
    pressIntervalRef.current = setInterval(() => {
      ignoreClickRef.current = true;
      (onHoldRebirthRef.current ?? onRebirthRef.current)();
    }, interval);
  }, [disabled, interval]);

  const endPress = useCallback(() => {
    setIsPressing(false);
    clearPressInterval();
  }, [clearPressInterval]);

  useEffect(() => {
    return () => {
      clearPressInterval();
    };
  }, [clearPressInterval]);

  const handleClickRebirth = useCallback(() => {
    if (disabled) return;

    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }

    onRebirthRef.current();
  }, [disabled]);

  const pressHandlers = {
    onMouseDown: (event: MouseEvent<HTMLDivElement>) => {
      if (disabled || touchActiveRef.current) return;
      if (event.button === 0) {
        startPress();
      }
    },
    onMouseUp: endPress,
    onMouseLeave: endPress,
    onTouchStart: () => {
      if (disabled) return;
      touchActiveRef.current = true;
      startPress();
    },
    onTouchEnd: () => {
      endPress();
      window.setTimeout(() => {
        touchActiveRef.current = false;
      }, 400);
    },
    onTouchCancel: () => {
      endPress();
      touchActiveRef.current = false;
    }
  };

  return {
    isPressing,
    pressHandlers,
    handleClickRebirth
  };
}
