import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BirthResult } from '@/lib/rebirth';
import { capRecords } from '@/lib/birth-storage';

interface BirthState {
  birthResults: BirthResult[];
  hasTrimmedRecords: boolean;
  addBirthResult: (result: BirthResult) => void;
  getLatestBirthResult: () => BirthResult | null;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  consumeTrimNotice: () => boolean;
}

export const useBirth = create<BirthState>()(
  persist(
    (set, get) => ({
      birthResults: [],
      hasTrimmedRecords: false,
      addBirthResult: (result: BirthResult) =>
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
      clearBirthResults: () => {
        set({ birthResults: [], hasTrimmedRecords: false });
      },
      consumeTrimNotice: () => {
        const shouldNotify = get().hasTrimmedRecords;
        if (shouldNotify) {
          set({ hasTrimmedRecords: false });
        }
        return shouldNotify;
      }
    }),
    {
      name: 'birth-storage',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ birthResults: state.birthResults })
    }
  )
);
