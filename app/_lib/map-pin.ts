import { BRAND_INK, BRAND_PRIMARY } from '@/lib/constants';
import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams
} from '@/lib/echarts';

export const MAP_PIN_PATH =
  'M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z';

export const MAP_BACKGROUND = '#f3efe8';

const PIN_SHAPE = {
  d: MAP_PIN_PATH,
  x: -10,
  y: -35,
  width: 20,
  height: 40
} as const;

const PIN_FILL_STYLE = {
  fill: BRAND_PRIMARY,
  stroke: BRAND_INK,
  lineWidth: 1,
  lineJoin: 'round' as const
};

const PIN_SHADOW_STYLE = {
  fill: BRAND_INK,
  opacity: 0.22
};

const RIPPLE_STYLE = {
  stroke: BRAND_INK,
  fill: 'none',
  lineWidth: 1.5,
  opacity: 0.28
};

export interface MapPinRenderOptions {
  rapidMode?: boolean;
  animated?: boolean;
  bounceDelay?: number;
}

export function renderMapPinItem(
  params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI,
  options: MapPinRenderOptions = {}
) {
  const { rapidMode = false, animated = true, bounceDelay = 0 } = options;

  const coord = api.coord([
    api.value(0, params.dataIndex),
    api.value(1, params.dataIndex)
  ]);

  const circles = animated
    ? Array.from({ length: rapidMode ? 3 : 5 }, (_, i) => ({
        type: 'circle' as const,
        shape: { cx: 0, cy: 0, r: 30 },
        style: RIPPLE_STYLE,
        keyframeAnimation: {
          duration: 4000,
          loop: true,
          delay: (-i / 4) * 4000,
          keyframes: [
            {
              percent: 0,
              scaleX: 0,
              scaleY: 0,
              style: { opacity: 0.45 }
            },
            {
              percent: 1,
              scaleX: 1,
              scaleY: 0.4,
              style: { opacity: 0 }
            }
          ]
        }
      }))
    : [];

  const pinShadow = {
    type: 'path' as const,
    shape: {
      ...PIN_SHAPE,
      y: PIN_SHAPE.y + 2
    },
    style: PIN_SHADOW_STYLE,
    silent: true
  };

  const pinPath = {
    type: 'path' as const,
    shape: PIN_SHAPE,
    style: PIN_FILL_STYLE,
    ...(animated
      ? {
          keyframeAnimation: {
            duration: rapidMode ? 450 : 1000,
            loop: true,
            delay: bounceDelay,
            keyframes: rapidMode
              ? [
                  { y: -6, percent: 0.5, easing: 'cubicOut' },
                  { y: 0, percent: 1, easing: 'cubicOut' }
                ]
              : [
                  { y: -10, percent: 0.5, easing: 'cubicOut' },
                  { y: 0, percent: 1, easing: 'bounceOut' }
                ]
          }
        }
      : {})
  };

  return {
    type: 'group',
    x: coord[0],
    y: coord[1],
    children: [...circles, pinShadow, pinPath]
  };
}

export function createMapPinSeries(
  coordinate: [number, number],
  geoIndex: number,
  options: MapPinRenderOptions = {}
) {
  const resolvedOptions: MapPinRenderOptions = {
    ...options,
    bounceDelay:
      options.bounceDelay ??
      (options.rapidMode ? 0 : Math.random() * 1000)
  };

  return {
    type: 'custom' as const,
    coordinateSystem: 'geo' as const,
    geoIndex,
    zlevel: 2,
    data: [coordinate],
    renderItem(
      params: CustomSeriesRenderItemParams,
      api: CustomSeriesRenderItemAPI
    ) {
      return renderMapPinItem(params, api, resolvedOptions);
    }
  };
}
