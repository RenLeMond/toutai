'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Toaster } from 'sonner';

const BASE_OFFSET_PX = 12;

function useVisualViewportBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const update = () => {
      const viewport = window.visualViewport;
      if (!viewport) {
        setInset(0);
        return;
      }

      setInset(
        Math.max(
          0,
          Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
        )
      );
    };

    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, []);

  return inset;
}

export default function AppToaster() {
  const viewportInset = useVisualViewportBottomInset();
  const bottomOffset = `calc(${BASE_OFFSET_PX}px + env(safe-area-inset-bottom, 0px) + ${viewportInset}px)`;

  return (
    <Toaster
      position="bottom-center"
      offset={32}
      mobileOffset={{
        bottom: bottomOffset,
        left: '12px',
        right: '12px'
      }}
      style={
        {
          '--offset-bottom': `calc(32px + env(safe-area-inset-bottom, 0px) + ${viewportInset}px)`,
          '--mobile-offset-bottom': bottomOffset
        } as CSSProperties
      }
    />
  );
}
