import { BRAND_INK, BRAND_PRIMARY } from '@/lib/constants';
import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams
} from '@/lib/echarts';

export const MAP_PIN_PATH =
  'M7 0C3.134 0 0 3.134 0 7C0 12.25 7 22 7 22C7 22 14 12.25 14 7C14 3.134 10.866 0 7 0Z';

export const MAP_BACKGROUND = '#f3efe8';

const PIN_SHAPE = {
  d: MAP_PIN_PATH,
  x: -7,
  y: -22,
  width: 14,
  height: 22
} as const;

const PIN_FILL_STYLE = {
  fill: BRAND_PRIMARY,
  stroke: BRAND_INK,
  lineWidth: 1.1,
  lineJoin: 'round' as const
};

const PIN_CORE_STYLE = {
  fill: '#ffffff'
};

const PIN_SHADOW_STYLE = {
  fill: BRAND_INK,
  opacity: 0.24
};

const RIPPLE_STYLE = {
  stroke: BRAND_PRIMARY,
  fill: 'none',
  lineWidth: 1.2,
  opacity: 0.35
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
        shape: { cx: 0, cy: 0, r: 24 },
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
              style: { opacity: 0.55 }
            },
            {
              percent: 1,
              scaleX: 1.4,
              scaleY: 0.55,
              style: { opacity: 0 }
            }
          ]
        }
      }))
    : [];

  const bounceKeyframes = rapidMode
    ? [
        { y: -4, percent: 0.5, easing: 'cubicOut' as const },
        { y: 0, percent: 1, easing: 'cubicOut' as const }
      ]
    : [
        { y: -7, percent: 0.5, easing: 'cubicOut' as const },
        { y: 0, percent: 1, easing: 'bounceOut' as const }
      ];

  const pinBounceAnimation = {
    duration: rapidMode ? 450 : 1000,
    loop: true,
    delay: bounceDelay,
    keyframes: bounceKeyframes
  };

  const pinShadow = {
    type: 'ellipse' as const,
    shape: {
      cx: 0,
      cy: 0,
      rx: 6,
      ry: 2.4
    },
    style: PIN_SHADOW_STYLE,
    silent: true,
    ...(animated
      ? {
          keyframeAnimation: {
            duration: rapidMode ? 450 : 1000,
            loop: true,
            delay: bounceDelay,
            keyframes: rapidMode
              ? [
                  {
                    scaleX: 0.8,
                    scaleY: 0.8,
                    percent: 0.5,
                    easing: 'cubicOut' as const
                  },
                  {
                    scaleX: 1,
                    scaleY: 1,
                    percent: 1,
                    easing: 'cubicOut' as const
                  }
                ]
              : [
                  {
                    scaleX: 0.7,
                    scaleY: 0.7,
                    percent: 0.5,
                    easing: 'cubicOut' as const
                  },
                  {
                    scaleX: 1,
                    scaleY: 1,
                    percent: 1,
                    easing: 'bounceOut' as const
                  }
                ]
          }
        }
      : {})
  };

  const pinPath = {
    type: 'path' as const,
    shape: PIN_SHAPE,
    style: PIN_FILL_STYLE,
    ...(animated ? { keyframeAnimation: pinBounceAnimation } : {})
  };

  const pinCore = {
    type: 'circle' as const,
    shape: {
      cx: 0,
      cy: -15,
      r: 2.8
    },
    style: PIN_CORE_STYLE,
    silent: true,
    ...(animated ? { keyframeAnimation: pinBounceAnimation } : {})
  };

  return {
    type: 'group',
    x: coord[0],
    y: coord[1],
    children: [...circles, pinShadow, pinPath, pinCore]
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
