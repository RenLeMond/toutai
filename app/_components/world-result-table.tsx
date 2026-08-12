'use client';

import React, { useMemo, useState } from 'react';
import { Pagination, Table, Text, View } from 'reshaped';
import { formatWorldProbability, WorldBirthResult } from '@/lib/world-rebirth';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import {
  formatCountryName,
  useWorldLocale
} from '@/lib/store/useWorldLocale';

type SortKey = 'count' | 'continent' | 'country' | 'probability';
type SortDir = 'asc' | 'desc';

type ResultRow = WorldBirthResult & { sequence: number };

function SortIndicator({
  active,
  dir
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active) return null;
  return (
    <Text as="span" variant="caption-1" color="primary">
      {dir === 'asc' ? ' ▲' : ' ▼'}
    </Text>
  );
}

function WorldResultTable() {
  const birthResults = useWorldBirth(state => state.birthResults);
  const nameLang = useWorldLocale(state => state.nameLang);
  const [sortKey, setSortKey] = useState<SortKey>('count');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const rows = useMemo<ResultRow[]>(() => {
    const base = birthResults.map((item, index) => ({
      ...item,
      sequence: index + 1
    }));

    const sorted = [...base].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'count':
          cmp = a.sequence - b.sequence;
          break;
        case 'continent':
          cmp = a.continent.localeCompare(b.continent, 'zh-CN');
          break;
        case 'country':
          cmp = formatCountryName(a, nameLang).localeCompare(
            formatCountryName(b, nameLang),
            nameLang === 'en' ? 'en' : 'zh-CN'
          );
          break;
        case 'probability':
          cmp = a.probability - b.probability;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [birthResults, nameLang, sortDir, sortKey]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / pageSize);

  const handleSort = (key: SortKey) => {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'count' ? 'desc' : 'asc');
  };

  const sortableHeading = (key: SortKey, label: string) => (
    <Table.Heading padding={1.5}>
      <button
        type="button"
        className="w-full cursor-pointer hover:text-primary"
        onClick={() => handleSort(key)}
      >
        <Text align="center">
          {label}
          <SortIndicator active={sortKey === key} dir={sortDir} />
        </Text>
      </button>
    </Table.Heading>
  );

  return (
    <View gap={4}>
      <View backgroundColor="neutral-faded" className="rounded-xl">
        <Table border columnBorder>
          <Table.Row highlighted>
            {sortableHeading('count', '投胎次数')}
            {sortableHeading('continent', '大洲')}
            {sortableHeading('country', '国家')}
            {sortableHeading('probability', '概率')}
          </Table.Row>
          {currentPageData.map(item => (
            <Table.Row key={`${item.countryEn}-${item.sequence}`}>
              <Table.Cell padding={1}>
                <Text align="center">{item.sequence}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.continent}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">
                  {formatCountryName(item, nameLang)}
                </Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">
                  {formatWorldProbability(item.probability)}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </View>
      {totalPages > 1 && (
        <View align="center">
          <Pagination
            page={currentPage}
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

export default WorldResultTable;
