'use client';

import china from '@/data/china.json';
import echarts from '@/lib/echarts';
import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { Loader, Text } from 'reshaped';
import { useBirth } from '@/lib/store/useBirth';
import { BirthResult } from '@/lib/rebirth';
import { BRAND_PRIMARY, MAP_HEAT_START } from '@/lib/constants';
import { createMapPinSeries, MAP_BACKGROUND } from '@/lib/map-pin';

const ShareMap = ({ region }: { region: string }) => {
  const birthResults = useBirth(
    (state: { birthResults: BirthResult[] }) => state.birthResults
  );
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

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

  const pinCoordinate = useMemo(() => {
    if (!region) return null;

    const feature = china.features.find(
      item => item.properties.name === region
    );

    return feature ? (feature.properties.cp as [number, number]) : null;
  }, [region]);

  const mapOption = useCallback(
    (mapName: string, data: typeof china) => {
      if (!chartRef.current) return;

      const myChart =
        echarts.getInstanceByDom(chartRef.current) ??
        echarts.init(chartRef.current);

      echarts.registerMap(mapName, data as never);

      const pinSeries = pinCoordinate
        ? [createMapPinSeries(pinCoordinate, 0, { animated: false })]
        : [];

      const option = {
        backgroundColor: MAP_BACKGROUND,
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
          zoom: 1.23,
          label: {
            show: false,
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
              show: false,
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
            }
          },
          ...pinSeries
        ]
      };
      myChart.setOption(option);
      setIsReady(true);
    },
    [bottomNumber, dataList, pinCoordinate, topNumber]
  );

  useEffect(() => {
    const chartElement = chartRef.current;
    mapOption('china', china);
    return () => {
      setIsReady(false);
      if (chartElement) {
        echarts.getInstanceByDom(chartElement)?.dispose();
      }
    };
  }, [mapOption]);

  return (
    <div className="relative h-48 w-full px-2">
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
};

export default ShareMap;
