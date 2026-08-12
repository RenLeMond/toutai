'use client';

import React, { useMemo } from 'react';
import { Text, useResponsiveClientValue, View } from 'reshaped';
import { CONTINENT_ORDER } from '@/lib/world-rebirth';
import { useWorldBirth } from '@/lib/store/useWorldBirth';

interface ContinentData {
  continent: string;
  probability: number;
  count: number;
}

function WorldContinentBar() {
  const percentage = useResponsiveClientValue({
    s: 56,
    l: 70
  });

  const birthResults = useWorldBirth(state => state.birthResults);

  const sortedResults: ContinentData[] = useMemo(() => {
    const counts = CONTINENT_ORDER.reduce(
      (acc, continent) => {
        acc[continent] = 0;
        return acc;
      },
      {} as Record<(typeof CONTINENT_ORDER)[number], number>
    );

    birthResults.forEach(result => {
      if (result.continent in counts) {
        counts[result.continent as keyof typeof counts] += 1;
      }
    });

    const total = birthResults.length || 1;

    return CONTINENT_ORDER.map(continent => ({
      continent,
      count: counts[continent],
      probability: counts[continent] / total
    }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.probability - a.probability);
  }, [birthResults]);

  const maxProbability =
    sortedResults.length > 0 ? sortedResults[0].probability : 0;

  return (
    <View direction="column" gap={1}>
      {sortedResults.map(item => (
        <View key={item.continent} direction="row" align="center" gap={2}>
          <View width={12}>
            <Text>{item.continent}</Text>
          </View>
          <div
            className="relative bg-[#ebe8e7] h-8 rounded-xl"
            style={{
              width:
                percentage !== undefined && maxProbability > 0
                  ? `${(item.probability / maxProbability) * percentage}%`
                  : '0%'
            }}
          >
            <Text
              variant="body-3"
              color="neutral-faded"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {(item.probability * 100).toFixed(2)}%
            </Text>
          </div>
          <Text variant="body-3" color="neutral-faded">
            {item.count}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default WorldContinentBar;
