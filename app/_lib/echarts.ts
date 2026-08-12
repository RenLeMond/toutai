import * as echarts from 'echarts/core';
import { CustomChart, MapChart } from 'echarts/charts';
import {
  GeoComponent,
  MarkPointComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  MapChart,
  CustomChart,
  GeoComponent,
  VisualMapComponent,
  TooltipComponent,
  MarkPointComponent,
  CanvasRenderer
]);

export default echarts;
export type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams
} from 'echarts';
