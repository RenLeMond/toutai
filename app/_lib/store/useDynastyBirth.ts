import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DynastyBirthResult } from '@/lib/dynasty-rebirth';
import { capRecords } from '@/lib/birth-storage';

interface DynastyBirthState {
  birthResults: DynastyBirthResult[];
  hasTrimmedRecords: boolean;
  addBirthResult: (result: DynastyBirthResult) => void;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  consumeTrimNotice: () => boolean;
}

export const useDynastyBirth = create<DynastyBirthState>()(
  persist(
    (set, get) => ({
      birthResults: [],
      hasTrimmedRecords: false,
      addBirthResult: (result: DynastyBirthResult) =>
        set(state => {
          const next = [...state.birthResults, result];
          const { records, trimmed } = capRecords(next);

          return {
            birthResults: records,
            hasTrimmedRecords: state.hasTrimmedRecords || trimmed
          };
        }),
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
      name: 'dynasty-birth-storage-v5',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ birthResults: state.birthResults })
    }
  )
);
