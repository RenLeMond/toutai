import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorldBirthResult } from '@/lib/world-rebirth';
import { capRecords } from '@/lib/birth-storage';

interface WorldBirthState {
  birthResults: WorldBirthResult[];
  hasTrimmedRecords: boolean;
  addBirthResult: (result: WorldBirthResult) => void;
  getLatestBirthResult: () => WorldBirthResult | null;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  consumeTrimNotice: () => boolean;
}

export const useWorldBirth = create<WorldBirthState>()(
  persist(
    (set, get) => ({
      birthResults: [],
      hasTrimmedRecords: false,
      addBirthResult: (result: WorldBirthResult) =>
        set(state => {
          const next = [...state.birthResults, result];
          const { records, trimmed } = capRecords(next);

          return {
            birthResults: records,
            hasTrimmedRecords: state.hasTrimmedRecords || trimmed
          };
        }),
      getLatestBirthResult: () => {
        const birthResults = get().birthResults;
        return birthResults.length > 0
          ? birthResults[birthResults.length - 1]
          : null;
      },
      getBirthResultsCount: () => get().birthResults.length,
      clearBirthResults: () => set({ birthResults: [], hasTrimmedRecords: false }),
      consumeTrimNotice: () => {
        const shouldNotify = get().hasTrimmedRecords;
        if (shouldNotify) {
          set({ hasTrimmedRecords: false });
        }
        return shouldNotify;
      }
    }),
    {
      name: 'world-birth-storage',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ birthResults: state.birthResults })
    }
  )
);
