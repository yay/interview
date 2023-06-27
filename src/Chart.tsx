import * as echarts from 'echarts';
import React, { type FC, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export type ChartApi = echarts.ECharts;

export interface ChartProps extends echarts.EChartsOption {
  ref?: React.MutableRefObject<ChartApi | undefined>;
  renderer?: 'canvas' | 'svg';
  theme?: string;
  setOptions?: echarts.SetOptionOpts;
}

const replaceMerge = ['series', 'xAxis', 'yAxis'];

export const useChartApiRef = () => useRef<ChartApi>();

const defaultRenderer = 'canvas';

const EChart = React.forwardRef<ChartApi, ChartProps>((props, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<ChartApi>();
  const [, setChartApi] = useState<ChartApi>();
  const createChart = useCallback(() => {
    const container = chartContainerRef.current as HTMLDivElement;
    const chart = echarts.init(container, props.theme, {
      renderer: props.renderer || defaultRenderer,
      useDirtyRect: false,
    });
    chartApiRef.current = chart;
    setChartApi(chart);
    return chart;
  }, [props.renderer, props.theme]);

  const resizeObserver = useMemo<ResizeObserver>(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const chart = chartApiRef.current;
          if (chart) {
            chart.resize({
              width,
              height,
            });
          }
        }
      }),
    []
  );

  useImperativeHandle(ref, () => createChart(), [createChart]);

  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    resizeObserver.observe(chartContainer);
    const chart = createChart();

    return () => {
      if (chartContainer) {
        resizeObserver.unobserve(chartContainer);
      }
      if (chart) {
        chart.dispose();
      }
    };
  }, [createChart, resizeObserver]);

  const chart = chartApiRef.current;
  if (chart) {
    chart.setOption(props, {
      replaceMerge,
      ...(props.setOptions || {}),
    });
  }

  return <div ref={chartContainerRef} style={autoSizeStyle} />;
}) as FC<ChartProps>;

const autoSizeStyle = { height: '100%', width: '100%' };

export const Chart = Object.assign(EChart, { registerTheme: echarts.registerTheme });

export default Chart;
