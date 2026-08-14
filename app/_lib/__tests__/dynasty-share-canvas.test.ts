import { describe, expect, it, vi } from 'vitest';
import {
  POSTER_WIDTH,
  POSTER_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_Y,
  CARD_SCALE,
  CSS_TITLE_SIZE,
  CSS_DESC_SIZE,
  CSS_BADGE_SIZE,
  TITLE_FONT_SIZE,
  DESC_FONT_SIZE,
  BADGE_FONT_SIZE,
  FONT_FAMILY,
  FOOTER_Y,
  TITLE_MAX_WIDTH,
  fitFontSize,
  truncateWithEllipsis,
  wrapTextToWidth,
  clampWrappedLines,
  layoutDynastyShareCardText,
  layoutFlavor,
  getDynastyOrnamentSvg,
  glowRgba,
  resolveAssetUrl,
  drawQrCode
} from '@/lib/dynasty-share-canvas';
import { DEFAULT_CLASS_LEVEL } from '@/lib/dynasty-rebirth';

const LONG_CLASS_NAME = '蒙古色目贵胄';
const LONG_CLASS_DESC = '朝堂三公九卿，每天批阅几百斤竹简，生怕KPI不达标。';
const LONG_FLAVOR = '六王毕，四海一！朕统六国，天下归一，大秦祖龙血统登顶！';
const LONG_BADGE = '南北朝 · 皇室';

function emMeasure(text: string, fontSize: number) {
  return text.length * fontSize;
}

const DYNASTY_IDS = [
  'QIN',
  'WESTERN_HAN',
  'XIN',
  'EASTERN_HAN',
  'THREE_KINGDOMS',
  'JIN',
  'SOUTHERN_NORTHERN',
  'SUI',
  'TANG',
  'SONG',
  'YUAN',
  'MING',
  'QING'
];

describe('dynasty-share-canvas', () => {
  it('has standard 3:4 high-res poster dimensions', () => {
    expect(POSTER_WIDTH).toBe(1080);
    expect(POSTER_HEIGHT).toBe(1440);
    expect(POSTER_WIDTH / POSTER_HEIGHT).toBeCloseTo(3 / 4);
  });

  it('has standard 5:7 high-res card dimensions', () => {
    expect(CARD_WIDTH).toBe(700);
    expect(CARD_HEIGHT).toBe(980);
    expect(CARD_WIDTH / CARD_HEIGHT).toBeCloseTo(5 / 7);
  });

  it('scales canvas type from the 200px result-card CSS', () => {
    expect(CARD_SCALE).toBe(3.5);
    expect(TITLE_FONT_SIZE).toBe(CSS_TITLE_SIZE * CARD_SCALE);
    expect(DESC_FONT_SIZE).toBe(CSS_DESC_SIZE * CARD_SCALE);
    expect(BADGE_FONT_SIZE).toBe(CSS_BADGE_SIZE * CARD_SCALE);
    expect(TITLE_FONT_SIZE).toBe(84);
    expect(DESC_FONT_SIZE).toBeCloseTo(40.25);
    expect(BADGE_FONT_SIZE).toBeCloseTo(38.5);
  });

  it('generates valid SVG ornaments for all 13 dynasties', () => {
    for (const id of DYNASTY_IDS) {
      const svg = getDynastyOrnamentSvg(id);
      expect(svg).toContain('<svg');
      expect(svg).toContain('viewBox="0 0 160 224"');
      expect(svg).toContain(`width="${CARD_WIDTH}"`);
      expect(svg).toContain(`height="${CARD_HEIGHT}"`);
      expect(svg).toContain('</svg>');
    }
  });

  it('emits a single stroke-width per SVG tag so canvas can load it as an image', () => {
    for (const id of DYNASTY_IDS) {
      const svg = getDynastyOrnamentSvg(id);
      const tags = svg.match(/<[^>]+>/g) ?? [];
      for (const tag of tags) {
        expect((tag.match(/stroke-width="/g) ?? []).length).toBeLessThanOrEqual(
          1
        );
      }
    }
  });

  it('keeps Qin, Song, and Xin frames distinct from Tang', () => {
    const qin = getDynastyOrnamentSvg('QIN');
    const song = getDynastyOrnamentSvg('SONG');
    const xin = getDynastyOrnamentSvg('XIN');
    const tang = getDynastyOrnamentSvg('TANG');

    expect(qin).toContain('width="120" height="184"');
    expect(qin).not.toContain('rx="22"');
    expect(song).toContain('width="120" height="184"');
    expect(song).toContain('stroke-width="1.2"');
    expect(song).not.toContain('rx="22"');
    expect(xin).toContain('79.33');
    expect(xin).not.toContain('rx="22"');
    expect(tang).toContain('rx="22"');
  });

  it('uses a 6-merlon Ming battlement that stays inside the 160 viewBox', () => {
    const svg = getDynastyOrnamentSvg('MING');
    const path = svg.match(/d="([^"]+)"/)?.[1] ?? '';
    expect((path.match(/V16/g) ?? []).length).toBe(6);
    expect((path.match(/h12/g) ?? []).length).toBe(11);
    const rightEdge = 14 + 11 * 12;
    expect(rightEdge).toBe(146);
    expect(rightEdge).toBeLessThan(160);
    expect(path.startsWith('M14 32')).toBe(true);
    expect(path).toContain('H14z');
    expect(path).toContain('h12v16');
    expect(svg).toContain('stroke-width="1.6"');
  });

  it('keeps the Qing cloud frame', () => {
    const svg = getDynastyOrnamentSvg('QING');
    expect(svg).toContain('y="28"');
    expect(svg).toContain('width="128" height="168"');
  });

  it('falls back gracefully to TANG for unknown dynasty IDs', () => {
    expect(getDynastyOrnamentSvg('UNKNOWN')).toBe(getDynastyOrnamentSvg('TANG'));
  });

  it('has default class level 3', () => {
    expect(DEFAULT_CLASS_LEVEL).toBe(3);
  });

  it('resolves asset URLs properly across absolute and relative protocols', () => {
    expect(resolveAssetUrl('https://example.com/icon.png')).toBe('https://example.com/icon.png');
    expect(resolveAssetUrl('http://example.com/icon.png')).toBe('http://example.com/icon.png');
    expect(resolveAssetUrl('data:image/png;base64,123')).toBe('data:image/png;base64,123');
    const rel = resolveAssetUrl('/icons/app-icon-64.png');
    expect(rel).toContain('/icons/app-icon-64.png');
  });

  it('draws QR code matrix to canvas context without throwing', () => {
    const fillRectMock = vi.fn();
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      fillStyle: '',
      fillRect: fillRectMock
    } as unknown as CanvasRenderingContext2D;

    drawQrCode(mockCtx, 'https://toutai.online/dynasty', 100, 100, 110);
    expect(fillRectMock).toHaveBeenCalled();
    expect(fillRectMock.mock.calls.length).toBeGreaterThan(10);
  });
});

describe('dynasty share font stack', () => {
  it('puts Inter and Arial before CJK fallbacks so digits match the page', () => {
    expect(FONT_FAMILY).toContain('Inter');
    expect(FONT_FAMILY).toContain('Arial');
    expect(FONT_FAMILY.indexOf('Inter')).toBeLessThan(
      FONT_FAMILY.indexOf('Microsoft YaHei')
    );
    expect(FONT_FAMILY.indexOf('Arial')).toBeLessThan(
      FONT_FAMILY.indexOf('PingFang SC')
    );
  });
});

describe('fitFontSize', () => {
  it('keeps max size when the text already fits', () => {
    expect(fitFontSize(emMeasure, '番匠', TITLE_MAX_WIDTH, 84, 58)).toBe(84);
  });

  it('shrinks until the text fits, not below min size', () => {
    const size = fitFontSize(emMeasure, '一二三', 200, 84, 58);
    expect(size).toBeGreaterThanOrEqual(58);
    expect(size).toBeLessThan(84);
    expect(emMeasure('一二三', size)).toBeLessThanOrEqual(200);
  });
});

describe('wrapTextToWidth and clampWrappedLines', () => {
  it('wraps long copy and clamps to two lines with an ellipsis', () => {
    const lines = wrapTextToWidth(emMeasure, LONG_CLASS_DESC, DESC_FONT_SIZE, 560);
    expect(lines.length).toBeGreaterThan(1);

    const clamped = clampWrappedLines(
      wrapTextToWidth(emMeasure, LONG_CLASS_DESC.repeat(4), DESC_FONT_SIZE, 560),
      2
    );
    expect(clamped).toHaveLength(2);
    expect(clamped[1].endsWith('…')).toBe(true);
  });
});

describe('truncateWithEllipsis', () => {
  it('adds an ellipsis when badge text exceeds the pill width', () => {
    const truncated = truncateWithEllipsis(
      emMeasure,
      LONG_BADGE.repeat(3),
      BADGE_FONT_SIZE,
      BADGE_FONT_SIZE * 4
    );
    expect(truncated.endsWith('…')).toBe(true);
    expect(emMeasure(truncated, BADGE_FONT_SIZE)).toBeLessThanOrEqual(
      BADGE_FONT_SIZE * 4
    );
  });
});

describe('layoutDynastyShareCardText', () => {
  it('uses 3.5x CSS type and keeps longest copy inside the card', () => {
    const layout = layoutDynastyShareCardText(
      emMeasure,
      emMeasure,
      emMeasure,
      {
        badgeText: LONG_BADGE,
        className: LONG_CLASS_NAME,
        classDesc: LONG_CLASS_DESC
      }
    );

    expect(layout.heroFontSize).toBeLessThanOrEqual(TITLE_FONT_SIZE);
    expect(layout.badgeFontSize).toBeLessThanOrEqual(BADGE_FONT_SIZE);
    expect(layout.titleLines.length).toBeGreaterThan(0);
    expect(layout.titleLines.length).toBeLessThanOrEqual(2);
    expect(layout.titleLineH).toBeCloseTo(layout.heroFontSize * 1.18);
    expect(layout.pillW).toBeLessThan(CARD_WIDTH);
    expect(layout.descLines.length).toBeLessThanOrEqual(2);
    expect(layout.descLineH).toBeCloseTo(DESC_FONT_SIZE * 1.45);
    expect(layout.stackH).toBeLessThanOrEqual(CARD_HEIGHT - 80);
    expect(layout.stackTop).toBeGreaterThanOrEqual(CARD_Y);
    expect(layout.stackTop + layout.stackH).toBeLessThanOrEqual(
      CARD_Y + CARD_HEIGHT
    );
  });
});

describe('layoutFlavor', () => {
  it('keeps the longest flavor above the footer band', () => {
    const flavor = layoutFlavor(emMeasure, LONG_FLAVOR);
    expect(flavor.lines.length).toBeLessThanOrEqual(2);
    expect(flavor.lines.length).toBeGreaterThan(0);

    const lastCenterY =
      flavor.startY + (flavor.lines.length - 1) * flavor.lineH;
    const lastBottom = lastCenterY + flavor.lineH / 2;
    expect(lastBottom).toBeLessThanOrEqual(FOOTER_Y);
    expect(flavor.startY - flavor.lineH / 2).toBeGreaterThanOrEqual(
      CARD_Y + CARD_HEIGHT
    );
  });
});

describe('glowRgba', () => {
  it('rebuilds rgba with a new alpha from rgb or rgba input', () => {
    expect(glowRgba('rgba(228, 174, 57, 0.45)', 0.85)).toBe(
      'rgba(228, 174, 57, 0.85)'
    );
    expect(glowRgba('rgb(235, 75, 75)', 0.35)).toBe('rgba(235, 75, 75, 0.35)');
  });

  it('accepts hex colors instead of returning an opaque stop', () => {
    expect(glowRgba('#e4ae39', 0.85)).toBe('rgba(228, 174, 57, 0.85)');
    expect(glowRgba('#eb4', 0.35)).toBe('rgba(238, 187, 68, 0.35)');
  });
});
