'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

const BASE_OFFSET_PX = 12;

function readVisualViewportBottomInset() {
  const viewport = window.visualViewport;
  if (!viewport) return 0;
  return Math.max(
    0,
    Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
  );
}

function useVisualViewportBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const commit = () => {
      frame = 0;
      const next = readVisualViewportBottomInset();
      setInset(prev => (prev === next ? prev : next));
    };

    const onViewportChange = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(commit);
    };

    commit();

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', onViewportChange);
      viewport.addEventListener('scroll', onViewportChange);
    } else {
      window.addEventListener('resize', onViewportChange);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', onViewportChange);
      viewport?.removeEventListener('scroll', onViewportChange);
      window.removeEventListener('resize', onViewportChange);
    };
  }, []);

  return inset;
}

export default function AppToaster() {
  const viewportInset = useVisualViewportBottomInset();
  // visualViewport inset already covers keyboard / browser chrome.
  // Only add safe-area when that gap is 0, so the home indicator is not counted twice.
  const mobileBottom =
    viewportInset > 0
      ? `${BASE_OFFSET_PX + viewportInset}px`
      : `calc(${BASE_OFFSET_PX}px + env(safe-area-inset-bottom, 0px))`;

  return (
    <Toaster
      position="bottom-center"
      offset={32}
      mobileOffset={{
        bottom: mobileBottom,
        left: '12px',
        right: '12px'
      }}
    />
  );
}
