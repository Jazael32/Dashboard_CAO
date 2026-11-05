'use client';

import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';

interface DashboardPieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--muted-foreground)'];
const config = { value: { label: 'Value' } } satisfies ChartConfig;

export const DashboardPieChart = ({ title, data }: DashboardPieChartProps) => {
  const items = useMemo(
    () => data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] })),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Top categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-55 max-w-70">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
            <Pie data={items} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} strokeWidth={4} />
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <i className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="font-medium">{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};