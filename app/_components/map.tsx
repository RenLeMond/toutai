'use client';

import china from '@/data/china.json';
import echarts from '@/lib/echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBirth } from '@/lib/store/useBirth';
import { BirthResult } from '@/lib/rebirth';
import { getProvinceStats } from '@/lib/china-stats';
import { BRAND_PRIMARY, MAP_HEAT_START } from '@/lib/constants';
import {
  CHINA_MAP_DEFAULT_CENTER,
  CHINA_MAP_DEFAULT_ZOOM,
  CHINA_MAP_FOCUS_ZOOM,
  MAP_NORMAL_ANIMATION_MS,
  MAP_RAPID_ANIMATION_MS
} from '@/lib/map-config';
import { createMapPinSeries, MAP_BACKGROUND } from '@/lib/map-pin';
import { useThrottledHeatData } from '@/hooks/useThrottledHeatData';

interface MapProps {
  rapidMode?: boolean;
}

const Map = ({ rapidMode = false }: MapProps) => {
  const birthResults = useBirth(
    (state: { birthResults: BirthResult[] }) => state.birthResults
  );
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const birthResultsRef = useRef(birthResults);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    birthResultsRef.current = birthResults;
  }, [birthResults]);

  const latestBirthResult = useMemo(
    () =>
      birthResults.length > 0
        ? birthResults[birthResults.length - 1]
        : null,
    [birthResults]
  );

  const dataList = useMemo(() => {
    const provinceMap: { [key: string]: number } = {};

    birthResults.forEach(result => {
      if (provinceMap[result.province]) {
        provinceMap[result.province] += result.probability;
      } else {
        provinceMap[result.province] = result.probability;
      }
    });

    return Object.entries(provinceMap).map(([name, value]) => ({
      name,
      value
    }));
  }, [birthResults]);

  const displayHeatData = useThrottledHeatData(
    dataList,
    birthResults.length,
    rapidMode
  );

  const topNumber =
    displayHeatData.length > 0
      ? Math.max(...displayHeatData.map(item => item.value))
      : 0;
  const bottomNumber =
    displayHeatData.length > 0
      ? Math.min(...displayHeatData.map(item => item.value))
      : 0;

  const pinCoordinate = useMemo(() => {
    if (!latestBirthResult) return null;

    const feature = china.features.find(
      item => item.properties.name === latestBirthResult.province
    );

    return feature ? (feature.properties.cp as [number, number]) : null;
  }, [latestBirthResult]);

  const applyChartOption = useCallback(
    (chart: ReturnType<typeof echarts.init>) => {
      const center = pinCoordinate ?? CHINA_MAP_DEFAULT_CENTER;
      const zoom = pinCoordinate ? CHINA_MAP_FOCUS_ZOOM : CHINA_MAP_DEFAULT_ZOOM;

      const pinSeries = pinCoordinate
        ? [createMapPinSeries(pinCoordinate, 0, { rapidMode })]
        : [];

      chart.setOption({
        backgroundColor: MAP_BACKGROUND,
        animationDurationUpdate: rapidMode
          ? MAP_RAPID_ANIMATION_MS
          : MAP_NORMAL_ANIMATION_MS,
        tooltip: {
          trigger: 'item',
          formatter: (params: { name?: string; seriesType?: string }) => {
            if (params.seriesType === 'custom') return '';

            const provinceName = params.name ?? '';
            if (!provinceName) return '';

            const stats = getProvinceStats(
              birthResultsRef.current,
              provinceName
            );

            return [
              stats.province,
              `出生次数：${stats.count} 次`,
              `经验概率：${(stats.empiricalRate * 100).toFixed(2)}%`,
              `理论概率：${(stats.theoreticalRate * 100).toFixed(2)}%`
            ].join('<br/>');
          }
        },
        visualMap: {
          min: 0,
          max: topNumber > 0 ? topNumber : 5,
          left: 'left',
          top: 'bottom',
          text: [topNumber.toFixed(2) + '%', bottomNumber.toFixed(2) + '%'],
          inRange: {
            color: [MAP_HEAT_START, BRAND_PRIMARY]
          },
          show: false
        },
        geo: {
          map: 'china',
          roam: false,
          zoom,
          center,
          label: {
            show: true,
            fontSize: '10',
            color: '#181716',
            fontWeight: 'medium'
          },
          itemStyle: {
            borderColor: '#bebfc0',
            areaColor: '#fcfcfd'
          },
          emphasis: {
            label: {
              show: true,
              color: '#181716'
            },
            itemStyle: {
              areaColor: '#afd8af'
            }
          },
          tooltip: {
            show: true
          }
        },
        series: [
          {
            name: '人口',
            type: 'map',
            geoIndex: 0,
            data: displayHeatData,
            select: {
              disabled: true
            }
          },
          ...pinSeries
        ]
      });
    },
    [
      bottomNumber,
      displayHeatData,
      pinCoordinate,
      rapidMode,
      topNumber
    ]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart =
      echarts.getInstanceByDom(chartRef.current) ??
      echarts.init(chartRef.current);
    chartInstanceRef.current = myChart;

    echarts.registerMap('china', china as never);
    setChartReady(true);

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
      chartInstanceRef.current = null;
      setChartReady(false);
    };
  }, []);

  useEffect(() => {
    if (!chartReady || !chartInstanceRef.current) return;
    applyChartOption(chartInstanceRef.current);
  }, [chartReady, applyChartOption]);

  return (
    <div
      className="map-stage md:min-h-[460px] min-h-[380px] md:w-[600px] w-full px-2"
      ref={chartRef}
    />
  );
};

export default Map;
