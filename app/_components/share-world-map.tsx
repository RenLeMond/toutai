'use client';

import world from '@/data/world.json';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef } from 'react';
import { Loader, Text } from 'reshaped';

interface ShareWorldMapProps {
  position: [number, number];
}

function ShareWorldMap({ position }: ShareWorldMapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const mapOption = useCallback(() => {
    if (!chartRef.current) return;

    const chart =
      echarts.getInstanceByDom(chartRef.current) ??
      echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    echarts.registerMap('world', world as never);

    chart.setOption({
      backgroundColor: '#fcfcfd',
      geo: {
        map: 'world',
        roam: false,
        zoom: 1.25,
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
          type: 'custom',
          coordinateSystem: 'geo',
          geoIndex: 0,
          data: [position],
          renderItem(
            params: echarts.CustomSeriesRenderItemParams,
            api: echarts.CustomSeriesRenderItemAPI
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
  }, [position]);

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
