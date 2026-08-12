'use client';

import world from '@/data/world.json';
import echarts, {
  type CustomSeriesRenderItemAPI,
  type CustomSeriesRenderItemParams
} from '@/lib/echarts';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Loader, Text } from 'reshaped';
import { toGeoName } from '@/lib/world-geo-aliases';
import { useWorldBirth } from '@/lib/store/useWorldBirth';

interface ShareWorldMapProps {
  position: [number, number];
  countryEn?: string;
}

function ShareWorldMap({ position, countryEn }: ShareWorldMapProps) {
  const birthResults = useWorldBirth(state => state.birthResults);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);

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
      backgroundColor: '#fcfcfd',
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
        {
          type: 'custom',
          coordinateSystem: 'geo',
          geoIndex: 0,
          zlevel: 2,
          data: [position],
          renderItem(
            params: CustomSeriesRenderItemParams,
            api: CustomSeriesRenderItemAPI
          ) {
            const coord = api.coord([
              api.value(0, params.dataIndex),
              api.value(1, params.dataIndex)
            ]);

            return {
              type: 'group',
              x: coord[0],
              y: coord[1],
              children: [
                {
                  type: 'path',
                  shape: {
                    d: 'M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z',
                    x: -10,
                    y: -35,
                    width: 20,
                    height: 40
                  },
                  style: { fill: '#ff4f04' }
                }
              ]
            };
          }
        }
      ]
    });
  }, [heatData, maxHeat, position]);

  useEffect(() => {
    mapOption();
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [mapOption]);

  return (
    <div
      className="flex flex-row space-x-2 items-center justify-center h-40 w-full rounded-xl overflow-hidden"
      ref={chartRef}
    >
      <Loader />
      <Text>地图加载中</Text>
    </div>
  );
}

export default ShareWorldMap;
