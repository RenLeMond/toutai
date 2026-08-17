'use client';

import world from '@/data/world.json';
import echarts, {
  type CustomSeriesRenderItemAPI,
  type CustomSeriesRenderItemParams
} from '@/lib/echarts';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  WorldBirthResult,
  worldCountryOptions
} from '@/lib/world-rebirth';
import { toGeoName } from '@/lib/world-geo-aliases';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import { useWorldLocale } from '@/lib/store/useWorldLocale';

const DEFAULT_CENTER: [number, number] = [17.228331, 26.3351];
const DEFAULT_ZOOM = 1.25;
const FOCUS_ZOOM = 2;
const HEAT_FLUSH_INTERVAL = 3;

type HeatDatum = {
  name: string;
  value: number;
  cn: string;
  en: string;
};

interface WorldMapProps {
  latestResult?: WorldBirthResult | null;
  rapidMode?: boolean;
}

const countryMetaByGeo = (() => {
  const map = new Map<string, { cn: string; en: string }>();
  worldCountryOptions.forEach(country => {
    map.set(toGeoName(country.en), { cn: country.cn, en: country.en });
  });
  return map;
})();

function buildHeatData(birthResults: WorldBirthResult[]): HeatDatum[] {
  const counts: Record<string, HeatDatum> = {};
  birthResults.forEach(result => {
    const geoName = toGeoName(result.countryEn);
    if (!counts[geoName]) {
      counts[geoName] = {
        name: geoName,
        value: 0,
        cn: result.country,
        en: result.countryEn
      };
    }
    counts[geoName].value += 1;
  });
  return Object.values(counts);
}

function WorldMap({ latestResult, rapidMode = false }: WorldMapProps) {
  const birthResults = useWorldBirth(state => state.birthResults);
  const nameLang = useWorldLocale(state => state.nameLang);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const nameLangRef = useRef(nameLang);
  const heatByGeoRef = useRef(new Map<string, HeatDatum>());

  const fullHeatData = useMemo(
    () => buildHeatData(birthResults),
    [birthResults]
  );

  const resultCount = birthResults.length;
  const [displayHeatData, setDisplayHeatData] = useState(fullHeatData);
  const [heatSync, setHeatSync] = useState({
    rapidMode,
    resultCount,
    fullHeatData,
    flushedLength: resultCount
  });

  // Adjust heat snapshot while rendering (React-recommended alternative to
  // setState-in-effect) so rapid press can throttle map repaints.
  if (
    rapidMode !== heatSync.rapidMode ||
    resultCount !== heatSync.resultCount ||
    fullHeatData !== heatSync.fullHeatData
  ) {
    const wasRapid = heatSync.rapidMode;
    const shouldFlush =
      !rapidMode ||
      !wasRapid ||
      resultCount - heatSync.flushedLength >= HEAT_FLUSH_INTERVAL;

    setHeatSync({
      rapidMode,
      resultCount,
      fullHeatData,
      flushedLength: shouldFlush ? resultCount : heatSync.flushedLength
    });

    if (shouldFlush) {
      setDisplayHeatData(fullHeatData);
    }
  }

  useEffect(() => {
    nameLangRef.current = nameLang;
  }, [nameLang]);

  useEffect(() => {
    const map = new Map<string, HeatDatum>();
    displayHeatData.forEach(item => map.set(item.name, item));
    heatByGeoRef.current = map;
  }, [displayHeatData]);

  const maxHeat =
    displayHeatData.length > 0
      ? Math.max(...displayHeatData.map(item => item.value))
      : 1;

  useEffect(() => {
    if (!chartRef.current) return;

    const chart =
      echarts.getInstanceByDom(chartRef.current) ??
      echarts.init(chartRef.current);
    chartInstanceRef.current = chart;
    echarts.registerMap('world', world as never);

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    const coordinate = latestResult?.position ?? DEFAULT_CENTER;
    const center = coordinate;
    const zoom = latestResult ? FOCUS_ZOOM : DEFAULT_ZOOM;

    const pinSeries = latestResult
      ? [
          {
            type: 'custom' as const,
            coordinateSystem: 'geo' as const,
            geoIndex: 0,
            zlevel: 2,
            data: [coordinate],
            renderItem(
              params: CustomSeriesRenderItemParams,
              api: CustomSeriesRenderItemAPI
            ) {
              const coord = api.coord([
                api.value(0, params.dataIndex),
                api.value(1, params.dataIndex)
              ]);
              const circles = Array.from(
                { length: rapidMode ? 3 : 5 },
                (_, i) => ({
                  type: 'circle',
                  shape: { cx: 0, cy: 0, r: 30 },
                  style: {
                    stroke: '#ff4f04',
                    fill: 'none',
                    lineWidth: 2
                  },
                  keyframeAnimation: {
                    duration: 4000,
                    loop: true,
                    delay: (-i / 4) * 4000,
                    keyframes: [
                      {
                        percent: 0,
                        scaleX: 0,
                        scaleY: 0,
                        style: { opacity: 1 }
                      },
                      {
                        percent: 1,
                        scaleX: 1,
                        scaleY: 0.4,
                        style: { opacity: 0 }
                      }
                    ]
                  }
                })
              );

              return {
                type: 'group',
                x: coord[0],
                y: coord[1],
                children: [
                  ...circles,
                  {
                    type: 'path',
                    shape: {
                      d: 'M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z',
                      x: -10,
                      y: -35,
                      width: 20,
                      height: 40
                    },
                    style: { fill: '#ff4f04' },
                    ...(rapidMode
                      ? {}
                      : {
                          keyframeAnimation: {
                            duration: 1000,
                            loop: true,
                            delay: Math.random() * 1000,
                            keyframes: [
                              { y: -10, percent: 0.5, easing: 'cubicOut' },
                              { y: 0, percent: 1, easing: 'bounceOut' }
                            ]
                          }
                        })
                  }
                ]
              };
            }
          }
        ]
      : [];

    chart.setOption({
      backgroundColor: '#f5f3ef',
      tooltip: {
        trigger: 'item',
        formatter: (params: {
          name?: string;
          value?: number | number[];
          data?: HeatDatum | number | { name?: string; value?: number };
          seriesType?: string;
        }) => {
          if (params.seriesType === 'custom') return '';

          const geoName = params.name ?? '';
          if (!geoName) return '';

          const heat = heatByGeoRef.current.get(geoName);
          const meta = countryMetaByGeo.get(geoName);
          const rawValue = params.value;
          const valueFromParams = Array.isArray(rawValue)
            ? rawValue[rawValue.length - 1]
            : rawValue;
          const count =
            heat?.value ??
            (typeof valueFromParams === 'number' && !Number.isNaN(valueFromParams)
              ? valueFromParams
              : 0);

          const label =
            nameLangRef.current === 'en'
              ? meta?.en ?? heat?.en ?? geoName
              : meta?.cn ?? heat?.cn ?? geoName;

          return `${label}<br/>累计 ${count} 次`;
        }
      },
      visualMap: {
        min: 0,
        max: maxHeat,
        show: false,
        inRange: {
          color: ['#f5e1d6', '#ff4f04']
        }
      },
      geo: {
        map: 'world',
        roam: true,
        zoom,
        center,
        scaleLimit: { min: 1, max: 8 },
        label: { show: false },
        itemStyle: {
          areaColor: '#fcfcfd',
          borderColor: '#bebfc0'
        },
        emphasis: {
          label: { show: false },
          itemStyle: { areaColor: '#afd8af' }
        }
      },
      series: [
        {
          name: '次数',
          type: 'map',
          geoIndex: 0,
          data: displayHeatData.map(item => ({
            name: item.name,
            value: item.value
          })),
          select: { disabled: true }
        },
        ...pinSeries
      ]
    });
  }, [latestResult, rapidMode, displayHeatData, maxHeat, nameLang]);

  return (
    <div
      className="md:min-h-[460px] min-h-[380px] md:w-[600px] w-full px-2"
      ref={chartRef}
    />
  );
}

export default WorldMap;
