import { describe, expect, it } from 'vitest';
import type { DynastyBirthResult } from '@/lib/dynasty-rebirth';
import { CLASS_STAMPS } from '@/lib/dynasty-rebirth';
import { buildDynastyShareInfo } from '@/lib/dynasty-share';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import { getShellPatternStyle } from '@/lib/dynasty-shell-pattern';

const result: DynastyBirthResult = {
  dynastyId: 'QIN',
  dynastyName: '秦朝',
  classId: 'q_1',
  className: '公卿重臣',
  classLevel: 1,
  classDesc: '列侯封君，权倾朝野。',
  gender: 'male',
  probability: 0.003
};

describe('buildDynastyShareInfo', () => {
  it('includes dynasty card fields and the toast flavor', () => {
    const info = buildDynastyShareInfo(result, 12, '天命所归，贵不可言！');

    expect(info.mode).toBe('dynasty');
    expect(info.count).toBe(12);
    expect(info.dynastyId).toBe('QIN');
    expect(info.dynastyName).toBe('秦朝');
    expect(info.className).toBe('公卿重臣');
    expect(info.classLevel).toBe(1);
    expect(info.classDesc).toBe('列侯封君，权倾朝野。');
    expect(info.flavor).toBe('天命所归，贵不可言！');
    expect(info.gender).toBe('male');
    expect(info.probability).toBe(0.003);
    expect(info.region).toBe('秦朝');
    expect(info.category).toBe('公卿重臣');
    expect(info.order).toBe(CLASS_STAMPS[1].name);
  });

  it('keeps an empty flavor instead of inventing one', () => {
    const info = buildDynastyShareInfo(result, 1, '');
    expect(info.flavor).toBe('');
  });
});

describe('getShellPatternStyle', () => {
  it('returns a repeating svg data uri html2canvas can paint', () => {
    const style = getShellPatternStyle('QING');
    expect(style.backgroundRepeat).toBe('repeat');
    expect(style.backgroundSize).toBe('22px 22px');
    expect(style.backgroundImage).toContain('data:image/svg+xml');
    expect(style.backgroundImage).not.toContain('#fff');
  });

  it('falls back to tang for unknown dynasties', () => {
    const style = getShellPatternStyle('missing');
    expect(style.backgroundSize).toBe('28px 28px');
  });
});

describe('dynastyCardVars', () => {
  it('uses only hex/rgb/rgba so html2canvas can parse share styles', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      const values = Object.values(dynastyCardVars(level));
      for (const value of values) {
        expect(value).toMatch(/^(#|rgb\(|rgba\()/);
        expect(value).not.toMatch(/color-mix|oklch|\bcolor\(/);
      }
    }
  });
});
