import { describe, expect, it } from 'vitest';
import {
  calculateBirthProbability,
  getProvinceTheoreticalRate,
  simulateBirth,
  totalPopulation
} from '@/lib/rebirth';

describe('rebirth', () => {
  it('simulateBirth returns a complete result', () => {
    const result = simulateBirth();

    expect(result.province).toBeTruthy();
    expect(['male', 'female']).toContain(result.gender);
    expect(result.probability).toBeGreaterThan(0);
    expect(result.probability).toBeLessThanOrEqual(1);
  });

  it('simulateBirth empirical rate tracks theoretical province share', () => {
    const iterations = 30_000;
    let guangDongCount = 0;

    for (let i = 0; i < iterations; i += 1) {
      const result = simulateBirth();
      if (result.province === '广东') {
        guangDongCount += 1;
      }
    }

    const empiricalRate = guangDongCount / iterations;
    const theoreticalRate = getProvinceTheoreticalRate('广东');

    expect(theoreticalRate).toBeGreaterThan(0.05);
    // Weighted binary search should stay within ~1.5pp of census share.
    expect(empiricalRate).toBeCloseTo(theoreticalRate, 1);
  });

  it('calculateBirthProbability returns values for mainland province', () => {
    const { population, probability } = calculateBirthProbability(
      'guang_dong',
      'city',
      'male',
      'one'
    );

    expect(population).toBeGreaterThan(0);
    expect(probability).toBeGreaterThan(0);
    expect(probability).toBeLessThan(1);
  });

  it('calculateBirthProbability works for Hong Kong', () => {
    const { population, probability } = calculateBirthProbability(
      'xiang_gang',
      'city',
      'male',
      'one'
    );

    expect(population).toBeGreaterThan(0);
    expect(probability).toBeGreaterThan(0);
  });

  it('getProvinceTheoreticalRate accepts display name and slug', () => {
    const byLabel = getProvinceTheoreticalRate('广东');
    const bySlug = getProvinceTheoreticalRate('guang_dong');

    expect(byLabel).toBeGreaterThan(0);
    expect(byLabel).toBeLessThan(1);
    expect(bySlug).toBe(byLabel);
  });

  it('totalPopulation is positive', () => {
    expect(totalPopulation).toBeGreaterThan(0);
  });
});
