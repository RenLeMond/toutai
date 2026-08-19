'use client';

import React, { useMemo, useState } from 'react';
import { Pagination, Table, Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  translateDynastyGender
} from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';

function DynastyResultTable() {
  const birthResults = useDynastyBirth(state => state.birthResults);
  const reversedResults = useMemo(
    () => [...birthResults].reverse(),
    [birthResults]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(reversedResults.length / pageSize);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const currentPageData = reversedResults.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <View gap={4}>
      <View className="record-card overflow-hidden">
        <Table border columnBorder>
          <Table.Row highlighted>
            <Table.Heading padding={1.5}>
              <Text align="center">次数</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">朝代</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">阶级</Text>
            </Table.Heading>
            <Table.Heading padding={1.5}>
              <Text align="center">性别</Text>
            </Table.Heading>
          </Table.Row>
          {currentPageData.map((item, index) => (
            <Table.Row key={`${item.dynastyId}-${item.classId}-${startIndex + index}`}>
              <Table.Cell padding={1}>
                <Text align="center" className="tabular-nums">
                  {reversedResults.length - (startIndex + index)}
                </Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.dynastyName}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center" className="break-words whitespace-normal">
                  {CLASS_STAMPS[item.classLevel].name} · {item.className}
                </Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">
                  {translateDynastyGender(item.gender)}
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
            onChange={args => setCurrentPage(args.page)}
          />
        </View>
      )}
    </View>
  );
}

export default DynastyResultTable;
