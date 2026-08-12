'use client';

import china from '@/data/china.json';
import echarts from '@/lib/echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'reshaped';
import { useBirth } from '@/lib/store/useBirth';
import { BirthResult } from '@/lib/rebirth';
import ProvinceDetailModal from '@/components/province-detail-modal';

const Map = () => {
  const birthResults = useBirth(
    (state: { birthResults: BirthResult[] }) => state.birthResults
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);

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

  const handleProvinceClick = useCallback((provinceName: string) => {
    setSelectedProvince(provinceName);
  }, []);

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
      visualMap: {
        min: 0,
        max: 5,
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

    const onClick = (params: { name?: string }) => {
      if (params.name) {
        handleProvinceClick(params.name);
      }
    };

    myChart.off('click');
    myChart.on('click', onClick);

    return () => {
      myChart.off('click', onClick);
    };
  }, [bottomNumber, dataList, handleProvinceClick, topNumber]);

  useEffect(() => {
    const chartElement = chartRef.current;

    return () => {
      if (chartElement) {
        echarts.getInstanceByDom(chartElement)?.dispose();
      }
    };
  }, []);

  return (
    <>
      <div
        className="flex flex-row space-x-2 items-center justify-center md:min-h-[460px] min-h-[320px] md:w-[600px] w-full px-2"
        ref={chartRef}
      />
      <ProvinceDetailModal
        province={selectedProvince}
        onClose={() => setSelectedProvince(null)}
      />
    </>
  );
};

export default Map;
