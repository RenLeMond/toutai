'use client';

import world from '@/data/world.json';
import echarts from '@/lib/echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader, Text } from 'reshaped';
import { toGeoName } from '@/lib/world-geo-aliases';
import { useWorldBirth } from '@/lib/store/useWorldBirth';
import { BRAND_PRIMARY, MAP_HEAT_START } from '@/lib/constants';
import { createMapPinSeries, MAP_BACKGROUND } from '@/lib/map-pin';

interface ShareWorldMapProps {
  position: [number, number];
  countryEn?: string;
}

function ShareWorldMap({ position, countryEn }: ShareWorldMapProps) {
  const birthResults = useWorldBirth(state => state.birthResults);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const [isReady, setIsReady] = useState(false);

  const heatData = useMemo(() => {
    const counts: Record<string, number> = {};
    birthResults.forEach(result => {
      const geoName = toGeoName(result.countryEn);
      counts[geoName] = (counts[geoName] || 0) + 1;
    });

    if (countryEn) {
      const currentGeo = toGeoName(countryEn);
      if (!counts[currentGeo]) {
        counts[currentGeo] = 1;
      }
    }

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [birthResults, countryEn]);

  const maxHeat =
    heatData.length > 0 ? Math.max(...heatData.map(item => item.value)) : 1;

  const mapOption = useCallback(() => {
    if (!chartRef.current) return;

    const chart =
      echarts.getInstanceByDom(chartRef.current) ??
      echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    echarts.registerMap('world', world as never);

    chart.setOption({
      backgroundColor: MAP_BACKGROUND,
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
        roam: false,
        zoom: 1.6,
        center: position,
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
          data: heatData,
          select: { disabled: true }
        },
        createMapPinSeries(position, 0, { animated: false })
      ]
    });
    setIsReady(true);
  }, [heatData, maxHeat, position]);

  useEffect(() => {
    mapOption();
    return () => {
      setIsReady(false);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [mapOption]);

  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden">
      <div className="absolute inset-0" ref={chartRef} />
      {!isReady && (
        <div
          className="absolute inset-0 flex flex-row items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Loader />
          <Text>地图加载中</Text>
        </div>
      )}
    </div>
  );
}

export default ShareWorldMap;
