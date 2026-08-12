'use client';

import React, { useMemo, useState } from 'react';
import { Button, FormControl, Select, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import {
  formatWorldProbability,
  getCountryProbability,
  worldCountryOptions
} from '@/lib/world-rebirth';
import { useWorldLocale } from '@/lib/store/useWorldLocale';
import WorldNameLangSwitch from '@/components/world-name-lang-switch';

function WorldCalculator() {
  const nameLang = useWorldLocale(state => state.nameLang);
  const [countryEn, setCountryEn] = useState('');
  const [result, setResult] = useState<ReturnType<
    typeof getCountryProbability
  > | null>(null);

  const options = useMemo(
    () =>
      worldCountryOptions.map(country => ({
        label: nameLang === 'en' ? country.en : country.cn,
        value: country.en
      })),
    [nameLang]
  );

  const handleCalculate = () => {
    setResult(getCountryProbability(countryEn));
  };

  return (
    <View gap={4}>
      <View direction="row" justify="end">
        <WorldNameLangSwitch />
      </View>
      <View paddingBlock={4} direction={{ s: 'column', m: 'row' }} gap={4}>
        <View.Item columns={{ s: 12, m: 6 }}>
          <FormControl>
            <FormControl.Label>出生国家</FormControl.Label>
            <Select
              name="country"
              placeholder="选择国家"
              options={options}
              value={countryEn}
              onChange={event => setCountryEn(String(event.value))}
            />
          </FormControl>
        </View.Item>
        <View.Item columns={{ s: 12, m: 3 }}>
          <View paddingTop={{ s: 0, m: 6 }}>
            <Button color="primary" onClick={handleCalculate} fullWidth>
              计算
            </Button>
          </View>
        </View.Item>
      </View>
      {result && (
        <View gap={2} paddingBlock={4}>
          <Text variant="body-2">
            出生在{' '}
            <span className="font-medium text-primary">
              {nameLang === 'en' ? result.countryEn : result.country}
            </span>
            （{result.continent}）的概率为{' '}
            <span className="font-medium text-primary">
              {formatWorldProbability(result.probability)}
            </span>
          </Text>
          <MathComponent formula="\displaystyle{\text{出生在该国家的可能性} = \frac{\text{该国出生人口}}{\text{全球总出生人口}}}" />
        </View>
      )}
    </View>
  );
}

export default WorldCalculator;
