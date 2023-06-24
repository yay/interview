import { FC, useCallback, useEffect, useState } from 'react';
import Chart from './Chart';
import { Box } from '@mui/material';
import { BarSeriesOption } from 'echarts';
import InfoIcon from '@mui/icons-material/Info';

export type SingleBarProps = {
  items: {
    name: string;
    value: number;
  }[];
  header?: React.ReactNode | ((params: SingleBarRenderParams) => React.ReactNode);
  footer?: React.ReactNode | ((params: SingleBarRenderParams) => React.ReactNode);
};

export type SingleBarRenderParams = {
  overlap?: boolean;
};

export type SingleBarHeaderProps = SingleBarRenderParams & {
  title?: React.ReactNode | (() => React.ReactNode);
  subtitle?: React.ReactNode | (() => React.ReactNode);
  overlapNotice?: React.ReactNode;
};

export const SingleBarHeader: FC<SingleBarHeaderProps> = (props) => {
  const { title, subtitle, overlap, overlapNotice } = props;
  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'end'} gap={0.5}>
      {title && render(title, {})}
      {subtitle && render(subtitle, {})}
      {overlap && overlapNotice && render(overlapNotice, {})}
      <InfoIcon sx={{ color: 'teal' }} />
    </Box>
  );
};

export type SingleBarFooterProps = SingleBarRenderParams;

export const SingleBarFoooter: FC<SingleBarFooterProps> = (props) => {
  const { overlap } = props;
  return overlap ? <div>Overlap!!!</div> : null;
};

export const SingleBar: FC<SingleBarProps> = (props) => {
  const { items = [], header, footer } = props;

  let overlap = false;

  const processedItems = items
    .slice()
    .reverse()
    .map((item, index, array) => {
      const nextItem = array[index + 1];
      let stackValue = item.value - (nextItem?.value || 0);
      if (stackValue < 0) {
        if (!overlap) {
          overlap = true;
        }
        stackValue = 0;
      }
      return {
        ...item,
        stackValue,
      };
    })
    .reverse()
    .filter((item) => item.stackValue > 0);

  const series: BarSeriesOption[] = processedItems.map((item, index) => {
    return {
      type: 'bar',
      stack: 'total',
      barWidth: 30,
      labelLayout: (params) => {
        const { seriesIndex } = params;
        return {
          dx: seriesIndex === 0 ? -5 : 5,
          dy: 40,
          hideOverlap: true,
        };
      },
      emphasis: {
        focus: 'series',
      },
      label: {
        show: true,
        minMargin: 10,
        formatter: (params) => {
          const value = processedItems[params.componentIndex].value;
          return `{a|${params.seriesName}}\n{b|$${value}M}`;
        },
        position: index === 0 ? 'insideBottomLeft' : 'insideBottomRight',
        rich: {
          a: {
            align: index === 0 ? 'left' : 'right',
            color: '#d3d3d3',
            fontSize: 12,
            lineHeight: 16,
          },
          b: {
            align: index === 0 ? 'left' : 'right',
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 20,
          },
        },
      } as BarSeriesOption['label'],
      name: item.name,
      data: [item.stackValue],
    } as BarSeriesOption;
  });

  const params = { overlap };

  return (
    <>
      {header && render(header, params)}
      <Box>
        <Chart
          backgroundColor={'black'}
          grid={{
            top: 0,
            right: 0,
            bottom: 30,
            left: 0,
            containLabel: false,
          }}
          xAxis={{
            type: 'value',
            max: 'dataMax',
            show: false,
          }}
          yAxis={{
            type: 'category',
            data: [''],
            show: true,
          }}
          series={series}
          tooltip={{
            trigger: 'item',
          }}
        />
      </Box>
      {footer && render(footer, params)}
    </>
  );
};

function render<T extends object>(
  value: React.ReactNode | ((params: T) => React.ReactNode) | undefined,
  params: T
): React.ReactNode {
  if (!value) return null;

  if (typeof value === 'function') {
    return value(params);
  }

  return value;
}
