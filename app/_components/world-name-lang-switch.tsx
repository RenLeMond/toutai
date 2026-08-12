'use client';

import React from 'react';
import { Text, View } from 'reshaped';
import { useWorldLocale } from '@/lib/store/useWorldLocale';

function WorldNameLangSwitch() {
  const nameLang = useWorldLocale(state => state.nameLang);
  const setNameLang = useWorldLocale(state => state.setNameLang);

  return (
    <View direction="row" align="center" gap={1}>
      <button
        type="button"
        aria-pressed={nameLang === 'zh'}
        onClick={() => setNameLang('zh')}
        className={`px-2 py-1 rounded-xl text-xs font-medium transition-colors ${
          nameLang === 'zh'
            ? 'bg-[#01ca78] text-white'
            : 'bg-[#e8e6e1] text-[#4a4a4a] hover:bg-[#dedbd4]'
        }`}
      >
        中文名
      </button>
      <button
        type="button"
        aria-pressed={nameLang === 'en'}
        onClick={() => setNameLang('en')}
        className={`px-2 py-1 rounded-xl text-xs font-medium transition-colors ${
          nameLang === 'en'
            ? 'bg-[#01ca78] text-white'
            : 'bg-[#e8e6e1] text-[#4a4a4a] hover:bg-[#dedbd4]'
        }`}
      >
        English
      </button>
    </View>
  );
}

export default WorldNameLangSwitch;
