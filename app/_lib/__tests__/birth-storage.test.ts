import { describe, expect, it } from 'vitest';
import { capRecords } from '@/lib/birth-storage';
import { MAX_BIRTH_RECORDS } from '@/lib/constants';
import {
  computeChinaPersonalStats,
  getProvinceStats
} from '@/lib/china-stats';
import type { BirthResult } from '@/lib/rebirth';

function createResult(province: string, overrides: Partial<BirthResult> = {}) {
  return {
    id: 1,
    province,
    category: '城市',
    gender: 'male',
    order: '一',
    probability: 0.01,
    ...overrides
  } satisfies BirthResult;
}

describe('birth-storage', () => {
  it('keeps records when under the cap', () => {
    const { records, trimmed } = capRecords([1, 2, 3]);
    expect(records).toEqual([1, 2, 3]);
    expect(trimmed).toBe(false);
  });

  it('trims oldest records when over the cap', () => {
    const input = Array.from({ length: MAX_BIRTH_RECORDS + 1 }, (_, index) => index);
    const { records, trimmed } = capRecords(input);

    expect(records).toHaveLength(MAX_BIRTH_RECORDS);
    expect(records[0]).toBe(1);
    expect(records.at(-1)).toBe(MAX_BIRTH_RECORDS);
    expect(trimmed).toBe(true);
  });
});

describe('china-stats', () => {
  it('getProvinceStats returns zero empirical rate without records', () => {
    const stats = getProvinceStats([], '广东');

    expect(stats.count).toBe(0);
    expect(stats.empiricalRate).toBe(0);
    expect(stats.theoreticalRate).toBeGreaterThan(0);
  });

  it('computeChinaPersonalStats aggregates province and gender counts', () => {
    const stats = computeChinaPersonalStats([
      createResult('广东'),
      createResult('广东', { gender: 'female' }),
      createResult('北京', { category: '乡村' })
    ]);

    expect(stats.total).toBe(3);
    expect(stats.uniqueProvinces).toBe(2);
    expect(stats.topProvince).toBe('广东');
    expect(stats.topProvinceCount).toBe(2);
    expect(stats.gender.male).toBe(2);
    expect(stats.gender.female).toBe(1);
    expect(stats.category.city).toBe(2);
    expect(stats.category.countryside).toBe(1);
  });
});
