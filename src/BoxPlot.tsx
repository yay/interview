import { FC, useCallback, useEffect, useState } from 'react';
import Chart, { useChartApiRef } from './Chart';
import { ECElementEvent, GraphicComponentOption } from 'echarts';
import { Box } from '@mui/material';

const data = [
  [20, 23, 25, 28, 32],
  [23, 25, 27, 29, 31],
  [19, 21, 24, 25, 29],
  [18, 24, 25, 26, 29],
];

const boxWidth = 9;

type BoxTarget = {
  shape?: {
    points?: [number, number][];
  };
};

export const BoxPlot: FC = () => {
  const chartApiRef = useChartApiRef();
  const [graphic, setGraphic] = useState<GraphicComponentOption>();

  const onMouseOver = useCallback(
    (params: ECElementEvent) => {
      const chart = chartApiRef.current;
      if (!chart || params.componentSubType !== 'boxplot') return;

      const points = (params?.event?.target as BoxTarget).shape?.points;
      if (!points) return;

      const xGap = 5;
      const yGap = 3;
      const xx = points.map((p) => p[0]);
      const yy = points.map((p) => p[1]);
      const x0 = Math.min(...xx) - xGap;
      const x1 = Math.max(...xx) + xGap;
      const y0 = Math.min(...yy) - yGap;
      const y1 = Math.max(...yy) + yGap;
      const width = Math.abs(x1 - x0);
      const height = Math.abs(y1 - y0);
      const r = Math.min(width, height) / 2;

      setGraphic({
        type: 'rect',

        x: x0,
        y: y0,
        z: 100,

        shape: {
          height,
          width,
          r,
        },

        style: {
          fill: undefined,
          lineWidth: 1,
          stroke: 'red',
        },
      });
    },
    [chartApiRef]
  );

  const onMouseOut = useCallback(() => setGraphic({ $action: 'replace' }), []);

  useEffect(() => {
    const chart = chartApiRef.current;
    if (!chart) return;

    chart.on('mouseover', onMouseOver);
    chart.on('mouseout', onMouseOut);
  }, [chartApiRef, onMouseOver, onMouseOut]);

  return (
    <Box style={{ width: '400px', height: '260px' }}>
      <Chart
        ref={chartApiRef}
        title={{
          text: 'Something Important',
        }}
        series={[
          {
            type: 'boxplot',
            colorBy: 'data',
            boxWidth: [boxWidth, boxWidth],
            data: data.map((item) => ({
              value: item,
            })),
          },
          {
            type: 'custom',
            name: 'median',
            colorBy: 'data',
            data: data.map((values) => values[2]),
            renderItem: (_params, api) => {
              const point = api.coord([api.value(0), api.value(1)]);
              const shape = {
                x1: point[0],
                x2: point[0],
                y1: point[1] - boxWidth / 2,
                y2: point[1] + boxWidth / 2,
              };
              return {
                type: 'line',
                shape,
                style: {
                  lineWidth: 3,
                  stroke: api.visual('color'),
                },
                transition: ['shape'],
              };
            },
            tooltip: {
              formatter: (params) => tooltipTableFormatter([['Market median', `$${params.value}M`]]),
            },
            z: 3,
          },
        ]}
        tooltip={{
          trigger: 'item',
          valueFormatter: (value) => (typeof value !== 'object' ? `$${value}M` : ''),
        }}
        graphic={graphic}
        grid={{
          top: 30,
          right: 8,
          bottom: 50,
          left: 8,
        }}
        xAxis={{
          type: 'value',
          axisLabel: {
            showMaxLabel: false,
            showMinLabel: false,
          },
          axisLine: {
            show: true,
          },
          axisTick: {
            show: true,
          },
          splitLine: {
            show: false,
          },
          max: 'dataMax',
          min: 'dataMin',
          name: 'in gazillions of SSD',
          nameGap: 30,
          nameLocation: 'middle',
        }}
        yAxis={{
          type: 'category',
          inverse: true,
          show: false,
          data: ['Market 1', 'Market 2', 'Market 3', 'Market 4'],
        }}
      />
    </Box>
  );
};

function tooltipTableFormatter(content: [string, number | string][]) {
  const lines = content.map(
    ([label, value]) =>
      `<tr>
        <td>${label}</td>
        <td style='text-align: right;'>&emsp;<b>${value}</b></td>
      </tr>`
  );
  return ['<table><tbody>', ...lines, '</tbody></table>'].join();
}
