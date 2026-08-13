'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppVersion } from '@/lib/store/useAppVersion';

function AppVersionHydrator() {
  const pathname = usePathname();
  const setVersion = useAppVersion(state => state.setVersion);
  const setHasHydrated = useAppVersion(state => state.setHasHydrated);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      if (!useAppVersion.getState().hasHydrated) {
        await useAppVersion.persist.rehydrate();
        if (cancelled) return;
      }

      if (pathname === '/') {
        setVersion('china');
      } else if (pathname === '/world' || pathname.startsWith('/world/')) {
        setVersion('world');
      } else if (pathname === '/dynasty' || pathname.startsWith('/dynasty/')) {
        setVersion('dynasty');
      }

      if (!useAppVersion.getState().hasHydrated) {
        setHasHydrated(true);
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [pathname, setVersion, setHasHydrated]);

  return null;
}

export default AppVersionHydrator;
