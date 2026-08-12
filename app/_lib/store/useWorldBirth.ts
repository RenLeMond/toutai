import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorldBirthResult, CONTINENT_ORDER } from '@/lib/world-rebirth';

export type ContinentCounts = Record<(typeof CONTINENT_ORDER)[number], number>;

interface WorldBirthState {
  birthResults: WorldBirthResult[];
  addBirthResult: (result: WorldBirthResult) => void;
  getLatestBirthResult: () => WorldBirthResult | null;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  getContinentCounts: () => ContinentCounts;
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
      addBirthResult: (result: WorldBirthResult) =>
        set(state => ({
          birthResults: [...state.birthResults, result]
        })),
      getLatestBirthResult: () => {
        const birthResults = get().birthResults;
        return birthResults.length > 0
          ? birthResults[birthResults.length - 1]
          : null;
      },
      getBirthResultsCount: () => get().birthResults.length,
      clearBirthResults: () => set({ birthResults: [] }),
      getContinentCounts: () => {
        const counts = createEmptyContinentCounts();
        get().birthResults.forEach(result => {
          if (result.continent in counts) {
            counts[result.continent as keyof ContinentCounts] += 1;
          }
        });
        return counts;
      }
    }),
    {
      name: 'world-birth-storage',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
