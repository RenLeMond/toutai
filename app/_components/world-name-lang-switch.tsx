'use client';

import React from 'react';
import { useWorldLocale } from '@/lib/store/useWorldLocale';
import { SegmentSwitch } from '@/components/segment-switch';

function WorldNameLangSwitch() {
  const nameLang = useWorldLocale(state => state.nameLang);
  const setNameLang = useWorldLocale(state => state.setNameLang);

  return (
    <SegmentSwitch
      value={nameLang}
      options={[
        { value: 'zh', label: '中文名' },
        { value: 'en', label: 'English' }
      ]}
      onChange={setNameLang}
      ariaLabel="国家名称语言"
      size="sm"
    />
  );
}

export default WorldNameLangSwitch;
