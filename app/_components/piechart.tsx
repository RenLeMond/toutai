import React, { useMemo } from 'react';

import { PieChart } from 'react-minimal-pie-chart';
import { useBirth } from '@/lib/store/useBirth';
import { BirthResult } from '@/lib/rebirth';
import { View, Text } from 'reshaped';
import { BRAND_PRIMARY } from '@/lib/constants';

const CHART_FEMALE = '#2a9d8f';

function Piechart() {
  const birthResults = useBirth(
    (state: { birthResults: BirthResult[] }) => state.birthResults
  );

  // Calculate the gender counts
  const genderCounts = useMemo(() => {
    const counts = { male: 0, female: 0 };

    birthResults.forEach(result => {
      if (result.gender === 'male') {
        counts.male += 1;
      } else if (result.gender === 'female') {
        counts.female += 1;
      }
    });

    return counts;
  }, [birthResults]);

  // Create the data array for the PieChart
  const datas = useMemo(
    () => [
      { title: '男孩', value: genderCounts.male, color: BRAND_PRIMARY },
      { title: '女孩', value: genderCounts.female, color: CHART_FEMALE }
    ],
    [genderCounts]
  );

  const lineWidth = 60;

  return (
    <>
      <View direction="row" justify="center" align="end" gap={{ s: 8, l: 16 }}>
        <PieChart
          className="w-52 sm:w-72"
          style={{
            fontSize: '7px'
          }}
          data={datas}
          radius={48}
          lineWidth={lineWidth}
          segmentsStyle={{ transition: 'stroke .3s' }}
          segmentsShift={1}
          animate
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
          labelPosition={100 - lineWidth / 2}
          labelStyle={{
            fill: '#fff',
            opacity: 0.75,
            pointerEvents: 'none'
          }}
        />
        <View direction="column" gap={2} paddingBottom={4} width={28}>
          <View direction="row" gap={1} align="center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: BRAND_PRIMARY }}
            />
            <Text className="tabular-nums">男孩：{genderCounts.male}</Text>
          </View>
          <View direction="row" gap={1} align="center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: CHART_FEMALE }}
            />
            <Text className="tabular-nums">女孩：{genderCounts.female}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default Piechart;
