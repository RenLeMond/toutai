import { describe, expect, it } from 'vitest';
import { HEAT_FLUSH_INTERVAL } from '@/lib/map-config';
import { shouldFlushHeatData } from '@/hooks/useThrottledHeatData';

describe('shouldFlushHeatData', () => {
  it('always flushes when not in rapid mode', () => {
    expect(shouldFlushHeatData(false, true, 2, 1)).toBe(true);
  });

  it('flushes when entering rapid mode', () => {
    expect(shouldFlushHeatData(true, false, 2, 1)).toBe(true);
  });

  it('throttles during rapid mode until flush interval', () => {
    expect(shouldFlushHeatData(true, true, 2, 1)).toBe(false);
    expect(shouldFlushHeatData(true, true, 3, 1)).toBe(false);
    expect(shouldFlushHeatData(true, true, 4, 1)).toBe(true);
  });

  it('uses configured flush interval', () => {
    expect(HEAT_FLUSH_INTERVAL).toBe(3);
  });
});
