import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorldBirthResult, CONTINENT_ORDER } from '@/lib/world-rebirth';
import { capRecords } from '@/lib/birth-storage';

export type ContinentCounts = Record<(typeof CONTINENT_ORDER)[number], number>;

interface WorldBirthState {
  birthResults: WorldBirthResult[];
  hasTrimmedRecords: boolean;
  addBirthResult: (result: WorldBirthResult) => void;
  getLatestBirthResult: () => WorldBirthResult | null;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  getContinentCounts: () => ContinentCounts;
  consumeTrimNotice: () => boolean;
}

const createEmptyContinentCounts = (): ContinentCounts =>
  CONTINENT_ORDER.reduce((acc, continent) => {
    acc[continent] = 0;
    return acc;
  }, {} as ContinentCounts);

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
      getContinentCounts: () => {
        const counts = createEmptyContinentCounts();
        get().birthResults.forEach(result => {
          if (result.continent in counts) {
            counts[result.continent as keyof ContinentCounts] += 1;
          }
        });
        return counts;
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
      name: 'world-birth-storage',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ birthResults: state.birthResults })
    }
  )
);
