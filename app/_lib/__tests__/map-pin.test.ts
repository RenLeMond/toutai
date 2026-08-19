import { describe, expect, it, vi } from 'vitest';
import {
  createMapPinSeries,
  renderMapPinItem
} from '@/lib/map-pin';

describe('map-pin', () => {
  it('renders pin shadow, path, and core without ripples when animated is false', () => {
    const api = {
      coord: vi.fn(() => [100, 200]),
      value: vi.fn((dim: number) => (dim === 0 ? 116.4 : 39.9))
    };

    const result = renderMapPinItem(
      { dataIndex: 0 } as never,
      api as never,
      { animated: false }
    );

    expect(result.type).toBe('group');
    expect(result.children).toHaveLength(3);
    expect(result.children?.[0].type).toBe('ellipse');
    expect(result.children?.[1].type).toBe('path');
    expect(result.children?.[2].type).toBe('circle');
  });

  it('renders ripples when animated is true', () => {
    const api = {
      coord: vi.fn(() => [50, 80]),
      value: vi.fn((dim: number) => (dim === 0 ? 10 : 20))
    };

    const result = renderMapPinItem(
      { dataIndex: 0 } as never,
      api as never,
      { animated: true, rapidMode: false }
    );

    expect(result.children).toHaveLength(8);
  });

  it('uses fewer ripples in rapid mode', () => {
    const api = {
      coord: vi.fn(() => [50, 80]),
      value: vi.fn((dim: number) => (dim === 0 ? 10 : 20))
    };

    const result = renderMapPinItem(
      { dataIndex: 0 } as never,
      api as never,
      { animated: true, rapidMode: true }
    );

    expect(result.children).toHaveLength(6);
  });

  it('fixes bounce delay when provided to createMapPinSeries', () => {
    const series = createMapPinSeries([116.4, 39.9], 0, {
      bounceDelay: 250
    });

    const api = {
      coord: vi.fn(() => [10, 20]),
      value: vi.fn((dim: number) => (dim === 0 ? 116.4 : 39.9))
    };

    const pin = series.renderItem({ dataIndex: 0 } as never, api as never);
    const pinPath = pin.children?.[pin.children.length - 2] as
      | { type?: string; keyframeAnimation?: { delay?: number } }
      | undefined;

    expect(pinPath?.type).toBe('path');
    expect(pinPath?.keyframeAnimation?.delay).toBe(250);
  });
});
