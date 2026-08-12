'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Dismissible, Modal, Text, View } from 'reshaped';
import { useBirth } from '@/lib/store/useBirth';
import { getProvinceStats } from '@/lib/china-stats';

interface ProvinceDetailModalProps {
  province: string | null;
  onClose: () => void;
}

function ProvinceDetailModal({ province, onClose }: ProvinceDetailModalProps) {
  const birthResults = useBirth(state => state.birthResults);
  const active = Boolean(province);

  if (!province) {
    return null;
  }

  const stats = getProvinceStats(birthResults, province);
  const isAboveAverage =
    stats.empiricalRate > 0 &&
    stats.theoreticalRate > 0 &&
    stats.empiricalRate > stats.theoreticalRate * 2;

  return (
    <Modal active={active} onClose={onClose} size="400px">
      <View padding={4} gap={4}>
        <Dismissible onClose={onClose} closeAriaLabel="关闭">
          <Text variant="featured-3" weight="medium">
            {stats.province}
          </Text>
        </Dismissible>

        <View gap={2}>
          <View direction="row" justify="space-between">
            <Text color="neutral-faded">出生次数</Text>
            <Text weight="medium">{stats.count} 次</Text>
          </View>
          <View direction="row" justify="space-between">
            <Text color="neutral-faded">经验概率</Text>
            <Text weight="medium" color="primary">
              {(stats.empiricalRate * 100).toFixed(2)}%
            </Text>
          </View>
          <View direction="row" justify="space-between">
            <Text color="neutral-faded">理论概率</Text>
            <Text weight="medium">
              {(stats.theoreticalRate * 100).toFixed(2)}%
            </Text>
          </View>
        </View>

        {isAboveAverage && (
          <Text variant="body-3" color="primary">
            你比平均更常出生在这里
          </Text>
        )}

        <View direction="row" justify="end" gap={2}>
          <Button variant="ghost" onClick={onClose}>
            关闭
          </Button>
          <Link href="/probability">
            <Button color="primary" onClick={onClose}>
              去计算器
            </Button>
          </Link>
        </View>
      </View>
    </Modal>
  );
}

export default ProvinceDetailModal;
