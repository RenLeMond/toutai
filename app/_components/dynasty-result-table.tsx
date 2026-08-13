'use client';

import React, { useState } from 'react';
import { Pagination, Table, Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  translateDynastyGender
} from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';

function DynastyResultTable() {
  const birthResults = useDynastyBirth(state => state.birthResults);
  const reversedResults = [...birthResults].reverse();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = reversedResults.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(reversedResults.length / pageSize);

  return (
    <View gap={4}>
      <View backgroundColor="neutral-faded" className="rounded-xl">
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
            <Table.Row key={index}>
              <Table.Cell padding={1}>
                <Text align="center">
                  {reversedResults.length - (startIndex + index)}
                </Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">{item.dynastyName}</Text>
              </Table.Cell>
              <Table.Cell padding={1}>
                <Text align="center">
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

export default DynastyResultTable;
