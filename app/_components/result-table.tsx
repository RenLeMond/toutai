'use client';

import React, { useMemo, useState } from 'react';
import { Pagination, Table, Text, View } from 'reshaped';
import { translateGender } from '@/lib/rebirth';
import { useBirth } from '@/lib/store/useBirth';

function ResultTable() {
  const birthResults = useBirth(state => state.birthResults);
  const reversedResults = useMemo(
    () => [...birthResults].reverse(),
    [birthResults]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(reversedResults.length / pageSize);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = reversedResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <View gap={4}>
      <View className="record-card">
        <Table border columnBorder>
          <Table.Row highlighted>
            <Table.Heading padding={1.5}>
              <Text align="center">投胎次数</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">性别</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">省份/地区</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">区域</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">第几孩</Text>
            </Table.Heading>
          </Table.Row>
          {currentPageData.map((item, index) => (
            <Table.Row key={`${item.province}-${item.gender}-${startIndex + index}`}>
              <Table.Cell padding={1}>
                <Text align="center" className="tabular-nums">
                  {reversedResults.length - (startIndex + index)}
                </Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{translateGender(item.gender)}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.province}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.category || '-'}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center" className="tabular-nums">
                  {item.order || '-'}
                </Text>
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

export default ResultTable;
