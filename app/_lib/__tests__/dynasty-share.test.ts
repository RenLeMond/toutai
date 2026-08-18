import { describe, expect, it } from 'vitest';
import type { DynastyBirthResult } from '@/lib/dynasty-rebirth';
import { CLASS_STAMPS } from '@/lib/dynasty-rebirth';
import { buildDynastyShareInfo } from '@/lib/dynasty-share';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import {
  DYNASTY_SHELL_IDS,
  getShellPatternStyle,
  SHELL_PATTERN_STROKE_MAIN,
  SHELL_PATTERN_STROKE_SUB,
  SHELL_PATTERN_TILE_WIDTH
} from '@/lib/dynasty-shell-pattern';

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
  function decodePatternSvg(backgroundImage: string) {
    const encoded = backgroundImage.match(/charset=utf-8,([^"]+)/)?.[1];
    expect(encoded).toBeTruthy();
    return decodeURIComponent(encoded!);
  }

  it('returns a repeating svg data uri html2canvas can paint', () => {
    const style = getShellPatternStyle('QING');
    expect(style.backgroundRepeat).toBe('repeat');
    expect(style.backgroundSize).toBe(
      `${SHELL_PATTERN_TILE_WIDTH}px ${SHELL_PATTERN_TILE_WIDTH}px`
    );
    expect(style.backgroundImage).toContain('data:image/svg+xml');
    expect(style.backgroundImage).not.toContain('#fff');
  });

  it('keeps css tile size in sync with svg intrinsic size and on-screen stroke', () => {
    for (const id of DYNASTY_SHELL_IDS) {
      const style = getShellPatternStyle(id);
      const svg = decodePatternSvg(style.backgroundImage);
      const widthAttr = svg.match(/width="([\d.]+)"/)?.[1];
      const viewBoxW = Number(svg.match(/viewBox="0 0 ([\d.]+)/)?.[1]);
      const [cssW] = style.backgroundSize.split(' ');

      expect(cssW).toBe(`${SHELL_PATTERN_TILE_WIDTH}px`);
      expect(widthAttr).toBe(String(SHELL_PATTERN_TILE_WIDTH));
      expect(viewBoxW).toBeGreaterThan(0);

      const scale = SHELL_PATTERN_TILE_WIDTH / viewBoxW;
      const strokes = [...svg.matchAll(/stroke-width="([\d.]+)"/g)].map(m =>
        Number(m[1])
      );
      expect(strokes.length).toBeGreaterThan(0);
      for (const stroke of strokes) {
        const onScreen = stroke * scale;
        const matchesMain =
          Math.abs(onScreen - SHELL_PATTERN_STROKE_MAIN) < 0.03;
        const matchesSub =
          Math.abs(onScreen - SHELL_PATTERN_STROKE_SUB) < 0.03;
        expect(matchesMain || matchesSub).toBe(true);
      }
    }
  });

  it('inverse-scales filled motif radii so Sui and Tang stay as fine as strokes', () => {
    for (const id of ['SUI', 'TANG'] as const) {
      const svg = decodePatternSvg(getShellPatternStyle(id).backgroundImage);
      const viewBoxW = Number(svg.match(/viewBox="0 0 ([\d.]+)/)?.[1]);
      const scale = SHELL_PATTERN_TILE_WIDTH / viewBoxW;
      const radii = [...svg.matchAll(/<circle[^>]+>/g)]
        .filter(match => /fill="#[^"]+"/.test(match[0]))
        .map(match => Number(match[0].match(/\sr="([\d.]+)"/)?.[1]));

      expect(radii.length).toBeGreaterThan(0);
      for (const r of radii) {
        expect(r * scale).toBeCloseTo(1.1, 1);
      }
    }
  });

  it('falls back to tang for unknown dynasties', () => {
    const style = getShellPatternStyle('missing');
    expect(style.backgroundSize).toBe(
      `${SHELL_PATTERN_TILE_WIDTH}px ${SHELL_PATTERN_TILE_WIDTH}px`
    );
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
