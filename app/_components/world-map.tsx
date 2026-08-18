'use client';

import world from '@/data/world.json';
import echarts from '@/lib/echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  WorldBirthResult,
  worldCountryOptions
} from '@/lib/world-rebirth';
import { toGeoName } from '@/lib/world-geo-aliases';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import { useWorldLocale } from '@/lib/store/useWorldLocale';
import { BRAND_PRIMARY, MAP_HEAT_START } from '@/lib/constants';
import {
  MAP_NORMAL_ANIMATION_MS,
  MAP_RAPID_ANIMATION_MS,
  WORLD_MAP_DEFAULT_CENTER,
  WORLD_MAP_DEFAULT_ZOOM,
  WORLD_MAP_FOCUS_ZOOM
} from '@/lib/map-config';
import { createMapPinSeries, MAP_BACKGROUND } from '@/lib/map-pin';
import { useThrottledHeatData } from '@/hooks/useThrottledHeatData';

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
  const [chartReady, setChartReady] = useState(false);

  const fullHeatData = useMemo(
    () => buildHeatData(birthResults),
    [birthResults]
  );

  const displayHeatData = useThrottledHeatData(
    fullHeatData,
    birthResults.length,
    rapidMode
  );

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

  const applyChartOption = useCallback(
    (chart: ReturnType<typeof echarts.init>) => {
      const coordinate = latestResult?.position ?? WORLD_MAP_DEFAULT_CENTER;
      const center = coordinate;
      const zoom = latestResult ? WORLD_MAP_FOCUS_ZOOM : WORLD_MAP_DEFAULT_ZOOM;

      const pinSeries = latestResult
        ? [createMapPinSeries(coordinate, 0, { rapidMode })]
        : [];

      chart.setOption({
        backgroundColor: MAP_BACKGROUND,
        animationDurationUpdate: rapidMode
          ? MAP_RAPID_ANIMATION_MS
          : MAP_NORMAL_ANIMATION_MS,
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
              (typeof valueFromParams === 'number' &&
              !Number.isNaN(valueFromParams)
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
            color: [MAP_HEAT_START, BRAND_PRIMARY]
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
    },
    [displayHeatData, latestResult, maxHeat, rapidMode]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const chart =
      echarts.getInstanceByDom(chartRef.current) ??
      echarts.init(chartRef.current);
    chartInstanceRef.current = chart;
    echarts.registerMap('world', world as never);
    setChartReady(true);

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
      setChartReady(false);
    };
  }, []);

  useEffect(() => {
    if (!chartReady || !chartInstanceRef.current) return;
    applyChartOption(chartInstanceRef.current);
  }, [chartReady, applyChartOption, nameLang]);

  return (
    <div
      className="map-stage md:min-h-[460px] min-h-[380px] md:w-[600px] w-full px-2"
      ref={chartRef}
    />
  );
}

export default WorldMap;
