import { describe, expect, it } from 'vitest';
import type { DynastyBirthResult } from '@/lib/dynasty-rebirth';
import {
  STEP,
  STRIP_TAIL,
  WIN_INDEX_BASE,
  buildIdleStrip,
  buildStrip,
  getCenteredIndex,
  getOffsetForIndex,
  getLandingSchedule,
  getSpinConfig,
  getSpinKeyframes,
  pickDecoy,
  spinProgress
} from '@/lib/dynasty-spin';

function mockResult(
  overrides: Partial<DynastyBirthResult> = {}
): DynastyBirthResult {
  return {
    dynastyId: 'QIN',
    dynastyName: '秦朝',
    classId: 'q_1',
    className: '公卿重臣',
    classLevel: 1,
    classDesc: '列侯封君，权倾朝野。',
    gender: 'male',
    probability: 0.003,
    ...overrides
  };
}

describe('dynasty-spin', () => {
  it('uses a CSGO-style accelerate, cruise, and brake', () => {
    const config = getSpinConfig();

    expect(config.overshootRatio).toBeGreaterThan(0.12);
    expect(config.overshootRatio).toBeLessThan(0.3);
    expect(config.duration).toBeGreaterThanOrEqual(1900);
    expect(config.duration).toBeLessThanOrEqual(2400);
    expect(config.tickMs).toBeGreaterThanOrEqual(280);
    expect(config.tickMs).toBeLessThanOrEqual(450);
    expect(spinProgress(0)).toBe(0);
    expect(spinProgress(0.14)).toBeCloseTo(0.1, 5);
    expect(spinProgress(0.14)).toBeLessThan(spinProgress(0.4));
    expect(spinProgress(1)).toBeCloseTo(1, 5);
  });

  it('maps strip translate back to the centered card index', () => {
    expect(getCenteredIndex(getOffsetForIndex(12))).toBe(12);
  });

  it('overshoots past the winner then ticks back to center', () => {
    const to = getOffsetForIndex(20);
    const config = getSpinConfig();
    const frames = getSpinKeyframes(0, to, {
      overshootRatio: config.overshootRatio,
      tickPortion: config.tickMs / (config.duration + config.tickMs)
    });
    const xs = frames.map(frame =>
      Number(frame.transform.match(/translate3d\(([-\d.]+)px/)?.[1])
    );
    const peak = Math.min(...xs);

    expect(peak).toBeLessThan(to);
    expect(xs[0]).toBeCloseTo(0, 5);
    expect(xs[xs.length - 1]).toBeCloseTo(to, 5);
    expect(frames[0]?.offset).toBe(0);
    expect(frames[frames.length - 1]?.offset).toBe(1);
    expect(Math.abs(peak - to)).toBeGreaterThan(STEP * 0.12);
    expect(Math.abs(peak - to)).toBeLessThan(STEP * 0.3);
  });

  it('picks the same decoy for the same seed', () => {
    expect(pickDecoy(7, 3)).toEqual(pickDecoy(7, 3));
  });

  it('weights decoys toward common classes', () => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    };

    for (let index = 0; index < 8000; index += 1) {
      counts[pickDecoy(index, 11).classLevel] += 1;
    }

    expect(counts[5]).toBeGreaterThan(counts[1] * 5);
    expect(counts[5]).toBeGreaterThan(counts[6]);
  });

  it('builds a stable idle strip for the default carousel', () => {
    const idle = buildIdleStrip(8);
    expect(idle).toHaveLength(8);
    expect(idle[0].dynastyName).toBeTruthy();
    expect(idle[0].classLevel).toBeGreaterThanOrEqual(1);
    expect(buildIdleStrip(8)[0]).toEqual(idle[0]);
  });

  it('places the winner at a stable strip index', () => {
    const result = mockResult({ dynastyName: '唐朝', classLevel: 3 });
    const { items, winIndex } = buildStrip(result, 2);
    const winner = items[winIndex];

    expect(winner.kind).toBe('winner');
    if (winner.kind === 'winner') {
      expect(winner.result.dynastyName).toBe('唐朝');
    }
    expect(items.filter(item => item.kind === 'winner')).toHaveLength(1);
    expect(winIndex).toBeGreaterThanOrEqual(WIN_INDEX_BASE);
    expect(winIndex).toBeLessThan(WIN_INDEX_BASE + 6);
    expect(items.length).toBe(winIndex + STRIP_TAIL);
    expect(items[winIndex - 1]?.kind).toBe('decoy');
  });

  it('holds the gold card on the front before flipping', () => {
    const gold = getLandingSchedule(1);
    const common = getLandingSchedule(5);

    expect(common.freeze).toBe(120);
    expect(common.pop).toBe(200);
    expect(common.hold).toBe(0);
    expect(common.flip).toBe(360);
    expect(common.completeAt).toBe(680);

    expect(gold.freeze).toBe(160);
    expect(gold.hold).toBe(280);
    expect(gold.flip).toBe(420);
    expect(gold.flipAt).toBe(640);
    expect(gold.completeAt).toBe(1060);
    expect(getLandingSchedule(2).hold).toBe(200);
    expect(getLandingSchedule(3).hold).toBe(140);
  });

  it('skips landing beats for reduced-motion draws', () => {
    const skipped = getLandingSchedule(1, true);

    expect(skipped.popAt).toBe(0);
    expect(skipped.flipAt).toBe(0);
    expect(skipped.completeAt).toBe(0);
    expect(skipped.flip).toBe(420);
  });
});
