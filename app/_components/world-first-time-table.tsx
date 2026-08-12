'use client';

import React, { useMemo, useState } from 'react';
import { Pagination, Table, Text, View } from 'reshaped';
import { formatWorldProbability } from '@/lib/world-rebirth';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import {
  formatCountryName,
  useWorldLocale
} from '@/lib/store/useWorldLocale';

function WorldFirstTimeTable() {
  const birthResults = useWorldBirth(state => state.birthResults);
  const nameLang = useWorldLocale(state => state.nameLang);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const uniqueResults = useMemo(() => {
    const seen = new Set<string>();
    const rows: {
      countryKey: string;
      country: string;
      continent: string;
      firstAppearance: number;
    }[] = [];

    birthResults.forEach((result, index) => {
      if (seen.has(result.countryEn)) return;
      seen.add(result.countryEn);
      rows.push({
        countryKey: result.countryEn,
        country: formatCountryName(result, nameLang),
        continent: result.continent,
        firstAppearance: index + 1
      });
    });

    return rows.sort((a, b) => b.firstAppearance - a.firstAppearance);
  }, [birthResults, nameLang]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = uniqueResults.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(uniqueResults.length / pageSize);

  return (
    <View gap={4}>
      <View backgroundColor="neutral-faded" className="rounded-xl">
        <Table border columnBorder>
          <Table.Row highlighted>
            <Table.Heading padding={1.5}>
              <Text align="center">国家</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">大洲</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">第一次出现</Text>
            </Table.Heading>
          </Table.Row>
          {currentPageData.map(item => (
            <Table.Row key={item.countryKey}>
              <Table.Cell padding={1}>
                <Text align="center">{item.country}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.continent}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">第 {item.firstAppearance} 次</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </View>
      {totalPages > 1 && (
        <View align="center">
          <Pagination
            total={totalPages}
            previousAriaLabel="上一页"
            nextAriaLabel="下一页"
            pageAriaLabel={args => `Page ${args.page}`}
            onChange={args => setCurrentPage(args.page)}
          />
        </View>
      )}
    </View>
  );
}

export default WorldFirstTimeTable;
