import { describe, expect, it } from 'vitest';
import {
  formatWorldProbability,
  getCountryProbability,
  simulateWorldBirth
} from '@/lib/world-rebirth';

describe('world-rebirth', () => {
  it('simulateWorldBirth returns a valid country', () => {
    const result = simulateWorldBirth();

    expect(result.country).toBeTruthy();
    expect(result.countryEn).toBeTruthy();
    expect(result.continent).toBeTruthy();
    expect(result.probability).toBeGreaterThan(0);
    expect(result.position).toHaveLength(2);
  });

  it('getCountryProbability returns null for unknown country', () => {
    expect(getCountryProbability('Not A Country')).toBeNull();
  });

  it('getCountryProbability returns data for known country', () => {
    const result = simulateWorldBirth();
    const probability = getCountryProbability(result.countryEn);

    expect(probability).not.toBeNull();
    expect(probability?.countryEn).toBe(result.countryEn);
  });

  it('formatWorldProbability renders percentage text', () => {
    expect(formatWorldProbability(1.2345)).toBe('1.2345%');
  });
});
