import { describe, expect, it, vi } from 'vitest';
import {
  POSTER_WIDTH,
  POSTER_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
  getDynastyOrnamentSvg,
  resolveAssetUrl,
  drawQrCode
} from '@/lib/dynasty-share-canvas';
import { DEFAULT_CLASS_LEVEL } from '@/lib/dynasty-rebirth';

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

  it('falls back gracefully to TANG for unknown dynasty IDs', () => {
    const svg = getDynastyOrnamentSvg('UNKNOWN');
    expect(svg).toContain('<svg');
    expect(svg).toContain('rx="22"');
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
