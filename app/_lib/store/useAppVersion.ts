import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppVersion = 'china' | 'world';

interface AppVersionState {
  version: AppVersion;
  hasHydrated: boolean;
  setVersion: (version: AppVersion) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAppVersion = create<AppVersionState>()(
  persist(
    set => ({
      version: 'china',
      hasHydrated: false,
      setVersion: (version: AppVersion) => set({ version }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated })
    }),
    {
      name: 'app-version',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ version: state.version })
    }
  )
);

export function resolveAppVersion(pathname: string, storedVersion: AppVersion) {
  if (pathname === '/world' || pathname.startsWith('/world/')) {
    return 'world' as const;
  }

  if (pathname === '/') {
    return 'china' as const;
  }

  return storedVersion;
}
