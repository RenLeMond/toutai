import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DynastyBirthResult } from '@/lib/dynasty-rebirth';
import { capRecords } from '@/lib/birth-storage';

interface DynastyBirthState {
  birthResults: DynastyBirthResult[];
  viewedAtlasKeys: Record<string, true>;
  hasTrimmedRecords: boolean;
  addBirthResult: (result: DynastyBirthResult) => void;
  markAtlasCardViewed: (key: string) => void;
  isAtlasCardViewed: (key: string) => boolean;
  getBirthResultsCount: () => number;
  clearBirthResults: () => void;
  consumeTrimNotice: () => boolean;
}

export const useDynastyBirth = create<DynastyBirthState>()(
  persist(
    (set, get) => ({
      birthResults: [],
      viewedAtlasKeys: {},
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
      markAtlasCardViewed: (key: string) =>
        set(state => {
          if (state.viewedAtlasKeys[key]) return state;
          return {
            viewedAtlasKeys: { ...state.viewedAtlasKeys, [key]: true }
          };
        }),
      isAtlasCardViewed: (key: string) => Boolean(get().viewedAtlasKeys[key]),
      getBirthResultsCount: () => get().birthResults.length,
      clearBirthResults: () => {
        set({ birthResults: [], viewedAtlasKeys: {}, hasTrimmedRecords: false });
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
      partialize: state => ({
        birthResults: state.birthResults,
        viewedAtlasKeys: state.viewedAtlasKeys
      })
    }
  )
);

