import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WorldNameLang = 'zh' | 'en';

interface WorldLocaleState {
  nameLang: WorldNameLang;
  setNameLang: (nameLang: WorldNameLang) => void;
}

export const useWorldLocale = create<WorldLocaleState>()(
  persist(
    set => ({
      nameLang: 'zh',
      setNameLang: (nameLang: WorldNameLang) => set({ nameLang })
    }),
    {
      name: 'world-name-lang',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export function formatCountryName(
  result: { country: string; countryEn: string },
  nameLang: WorldNameLang
) {
  return nameLang === 'en' ? result.countryEn : result.country;
}
