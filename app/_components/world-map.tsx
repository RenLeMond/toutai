'use client';

import world from '@/data/world.json';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { WorldBirthResult } from '@/lib/world-rebirth';

const DEFAULT_CENTER: [number, number] = [17.228331, 26.3351];
const DEFAULT_ZOOM = 1.25;
const FOCUS_ZOOM = 2;

interface WorldMapProps {
  latestResult?: WorldBirthResult | null;
}

function WorldMap({ latestResult }: WorldMapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

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
    const center = latestResult?.position ?? DEFAULT_CENTER;
    const zoom = latestResult ? FOCUS_ZOOM : DEFAULT_ZOOM;

    chart.setOption({
      backgroundColor: '#f5f3ef',
      geo: {
        map: 'world',
        roam: true,
        zoom,
        center,
        scaleLimit: {
          min: 1,
          max: 8
        },
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#fcfcfd',
          borderColor: '#bebfc0'
        },
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            areaColor: '#afd8af'
          }
        }
      },
      series: latestResult
        ? [
            {
              type: 'custom',
              coordinateSystem: 'geo',
              geoIndex: 0,
              zlevel: 1,
              data: [coordinate],
              renderItem(
                params: echarts.CustomSeriesRenderItemParams,
                api: echarts.CustomSeriesRenderItemAPI
              ) {
                const coord = api.coord([
                  api.value(0, params.dataIndex),
                  api.value(1, params.dataIndex)
                ]);
                const circles = [];

                for (let i = 0; i < 5; i++) {
                  circles.push({
                    type: 'circle',
                    shape: {
                      cx: 0,
                      cy: 0,
                      r: 30
                    },
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
                          style: {
                            opacity: 1
                          }
                        },
                        {
                          percent: 1,
                          scaleX: 1,
                          scaleY: 0.4,
                          style: {
                            opacity: 0
                          }
                        }
                      ]
                    }
                  });
                }

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
                      style: {
                        fill: '#ff4f04'
                      },
                      keyframeAnimation: {
                        duration: 1000,
                        loop: true,
                        delay: Math.random() * 1000,
                        keyframes: [
                          {
                            y: -10,
                            percent: 0.5,
                            easing: 'cubicOut'
                          },
                          {
                            y: 0,
                            percent: 1,
                            easing: 'bounceOut'
                          }
                        ]
                      }
                    }
                  ]
                };
              }
            }
          ]
        : []
    });
  }, [latestResult]);

  return (
    <div
      className="md:min-h-[460px] min-h-[320px] md:w-[600px] w-full px-2"
      ref={chartRef}
    />
  );
}

export default WorldMap;
