'use client';

import React, { useMemo } from 'react';
import { Table, Text, View } from 'reshaped';
import { CONTINENT_ORDER } from '@/lib/world-rebirth';
import { useWorldBirth } from '@/lib/store/useWorldBirth';

function ContinentStats() {
  const birthResults = useWorldBirth(state => state.birthResults);

  const { counts, total } = useMemo(() => {
    const nextCounts = CONTINENT_ORDER.reduce(
      (acc, continent) => {
        acc[continent] = 0;
        return acc;
      },
      {} as Record<(typeof CONTINENT_ORDER)[number], number>
    );

    birthResults.forEach(result => {
      if (result.continent in nextCounts) {
        nextCounts[result.continent as keyof typeof nextCounts] += 1;
      }
    });

    return {
      counts: nextCounts,
      total: birthResults.length
    };
  }, [birthResults]);

  return (
    <View gap={2} width="100%">
      <View backgroundColor="neutral-faded" className="rounded-xl">
        <Table border columnBorder>
          <Table.Row highlighted>
            <Table.Heading padding={1.5}>
              <Text align="center">重生次数</Text>
            </Table.Heading>
            {CONTINENT_ORDER.slice(0, 3).map(continent => (
              <Table.Heading key={continent} padding={1.5}>
                <Text align="center">{continent}</Text>
              </Table.Heading>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.Cell padding={1}>
              <Text align="center">{total}</Text>
            </Table.Cell>
            {CONTINENT_ORDER.slice(0, 3).map(continent => (
              <Table.Cell key={continent} padding={1}>
                <Text align="center">{counts[continent]}</Text>
              </Table.Cell>
            ))}
          </Table.Row>
        </Table>
      </View>
      <View backgroundColor="neutral-faded" className="rounded-xl">
        <Table border columnBorder>
          <Table.Row highlighted>
            {CONTINENT_ORDER.slice(3).map(continent => (
              <Table.Heading key={continent} padding={1.5}>
                <Text align="center">{continent}</Text>
              </Table.Heading>
            ))}
          </Table.Row>
          <Table.Row>
            {CONTINENT_ORDER.slice(3).map(continent => (
              <Table.Cell key={continent} padding={1}>
                <Text align="center">{counts[continent]}</Text>
              </Table.Cell>
            ))}
          </Table.Row>
        </Table>
      </View>
    </View>
  );
}

export default ContinentStats;
