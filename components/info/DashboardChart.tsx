'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartSeries } from '@/lib/dataset/types';

interface Props {
  title: string;
  datasetName: string;
  series: ChartSeries[];
  data: Record<string, string | number>[];
}

const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

export const DashboardChart = ({ title, datasetName, series, data }: Props) => {
  const config = Object.fromEntries(
    series.map((s, i) => [`s${i}`, { label: s.label, color: `var(--chart-${(i % 5) + 1})` }]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>From {datasetName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-70 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="x" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => compact.format(v)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((_, i) => (
              <Bar key={i} dataKey={`s${i}`} fill={`var(--color-s${i})`} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};