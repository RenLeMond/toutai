'use client';

import React, { useMemo, useState } from 'react';
import { Icon, Pagination, Table, Text, Tooltip, View } from 'reshaped';
import { useBirth } from '@/lib/store/useBirth';
import { CircleHelp } from 'lucide-react';
import { BirthResult } from '@/lib/rebirth';
import { FemaleIcon, MaleIcon } from '@/components/gender-icon';

interface UniqueResult {
  province: string;
  firstBoyAppearance: number | string;
  firstGirlAppearance: number | string;
}

function FirstTimeTable() {
  const birthResults = useBirth(state => state.birthResults) as BirthResult[];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  const uniqueResults = useMemo<UniqueResult[]>(() => {
    const firstBoyByProvince = new Map<string, number>();
    const firstGirlByProvince = new Map<string, number>();
    const seenProvinces = new Set<string>();

    birthResults.forEach((item, index) => {
      seenProvinces.add(item.province);
      if (item.gender === 'male' && !firstBoyByProvince.has(item.province)) {
        firstBoyByProvince.set(item.province, index + 1);
      } else if (
        item.gender === 'female' &&
        !firstGirlByProvince.has(item.province)
      ) {
        firstGirlByProvince.set(item.province, index + 1);
      }
    });

    const results: UniqueResult[] = Array.from(seenProvinces).map(province => {
      const boy = firstBoyByProvince.get(province);
      const girl = firstGirlByProvince.get(province);
      return {
        province,
        firstBoyAppearance: boy !== undefined ? boy : 'N/A',
        firstGirlAppearance: girl !== undefined ? girl : 'N/A'
      };
    });

    return results.sort((a, b) => {
      const aBoy =
        a.firstBoyAppearance !== 'N/A'
          ? Number(a.firstBoyAppearance)
          : Infinity;
      const aGirl =
        a.firstGirlAppearance !== 'N/A'
          ? Number(a.firstGirlAppearance)
          : Infinity;
      const bBoy =
        b.firstBoyAppearance !== 'N/A'
          ? Number(b.firstBoyAppearance)
          : Infinity;
      const bGirl =
        b.firstGirlAppearance !== 'N/A'
          ? Number(b.firstGirlAppearance)
          : Infinity;

      const aMinAppearance = Math.min(aBoy, aGirl);
      const bMinAppearance = Math.min(bBoy, bGirl);

      return bMinAppearance - aMinAppearance;
    });
  }, [birthResults]);

  const totalPages = Math.ceil(uniqueResults.length / pageSize);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageResults = uniqueResults.slice(startIndex, endIndex);

  return (
    <View gap={4}>
      <View className="record-card">
        <Table border columnBorder>
          <Table.Row highlighted>
            <Table.Heading padding={1.5}>
              <Text align="center">省份/地区</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <View align="center">
                <Tooltip text="男孩和女孩第一次出现的序号" position="top">
                  {attributes => (
                    <View direction="row" align="center" gap={1}>
                      <Text align="center">第一次出现</Text>
                      <Icon svg={<CircleHelp />} attributes={attributes} />
                    </View>
                  )}
                </Tooltip>
              </View>
            </Table.Heading>
          </Table.Row>
          {currentPageResults.map(item => (
            <Table.Row key={item.province}>
              <Table.Cell padding={1}>
                <Text align="center">{item.province}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <View direction="row" justify="center" gap={3}>
                  {item.firstBoyAppearance !== 'N/A' && (
                    <View direction="row" align="center" gap={1}>
                      <MaleIcon size={12} />
                      <Text align="center" className="tabular-nums">
                        {item.firstBoyAppearance}
                      </Text>
                    </View>
                  )}
                  {item.firstGirlAppearance !== 'N/A' && (
                    <View direction="row" align="center" gap={1}>
                      <FemaleIcon size={14} />
                      <Text align="center" className="tabular-nums">
                        {item.firstGirlAppearance}
                      </Text>
                    </View>
                  )}
                  {item.firstBoyAppearance === 'N/A' &&
                    item.firstGirlAppearance === 'N/A' && (
                      <Text align="center">-</Text>
                    )}
                </View>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </View>
      {totalPages > 1 && (
        <View align="center">
          <Pagination
            page={safeCurrentPage}
            total={totalPages}
            previousAriaLabel="上一页"
            nextAriaLabel="下一页"
            pageAriaLabel={args => `第 ${args.page} 页`}
            onChange={args => handlePageChange(args.page)}
          />
        </View>
      )}
    </View>
  );
}

export default FirstTimeTable;
