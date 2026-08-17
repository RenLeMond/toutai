'use client';

import china from '@/data/china.json';
import echarts from '@/lib/echarts';
import { useEffect, useMemo, useRef } from 'react';
import { useBirth } from '@/lib/store/useBirth';
import { BirthResult } from '@/lib/rebirth';
import { getProvinceStats } from '@/lib/china-stats';

const Map = () => {
  const birthResults = useBirth(
    (state: { birthResults: BirthResult[] }) => state.birthResults
  );
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const birthResultsRef = useRef(birthResults);

  useEffect(() => {
    birthResultsRef.current = birthResults;
  }, [birthResults]);

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

  const topNumber =
    dataList.length > 0 ? Math.max(...dataList.map(item => item.value)) : 0;
  const bottomNumber =
    dataList.length > 0 ? Math.min(...dataList.map(item => item.value)) : 0;

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart =
      echarts.getInstanceByDom(chartRef.current) ?? echarts.init(chartRef.current);
    chartInstanceRef.current = myChart;

    echarts.registerMap('china', china as never);

    const latestBirthResult = useBirth.getState().getLatestBirthResult();
    const currentProvince = latestBirthResult?.province;

    const markPointData = currentProvince
      ? china.features.find(
          feature => feature.properties.name === currentProvince
        )
      : null;

    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params: { name?: string; seriesType?: string }) => {
          if (params.seriesType === 'effectScatter') return '';

          const provinceName = params.name ?? '';
          if (!provinceName) return '';

          const stats = getProvinceStats(birthResultsRef.current, provinceName);

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
          color: ['#f5e1d6', '#ff4f04']
        },
        show: false
      },
      geo: {
        map: 'china',
        roam: false,
        zoom: 1.23,
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
          data: dataList,
          select: {
            disabled: true
          },
          markPoint: {
            symbol: 'pin',
            symbolSize: 30,
            animationDuration: 100,
            itemStyle: {
              color: '#01ca78'
            },
            tooltip: {
              show: false
            },
            data: markPointData
              ? [
                  {
                    name: currentProvince,
                    coord: markPointData.properties.cp
                  }
                ]
              : []
          }
        }
      ]
    });
  }, [bottomNumber, dataList, topNumber]);

  useEffect(() => {
    const chartElement = chartRef.current;

    return () => {
      if (chartElement) {
        echarts.getInstanceByDom(chartElement)?.dispose();
      }
    };
  }, []);

  return (
    <div
      className="flex flex-row space-x-2 items-center justify-center md:min-h-[460px] min-h-[320px] md:w-[600px] w-full px-2"
      ref={chartRef}
    />
  );
};

export default Map;
