'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { Pie, PieChart } from 'recharts'
import { channelConfig, channelData } from '@/data/mock-data'

export const DashboardPieChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by channel</CardTitle>
        <CardDescription>Where your revenue is coming from.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={channelConfig} className="mx-auto h-55 max-w-70">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={channelData}
              dataKey="value"
              nameKey="channel"
              innerRadius={62}
              outerRadius={90}
              strokeWidth={4}
            />
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {channelData.map((item) => (
            <div key={item.channel} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <i
                  className="size-2 rounded-full"
                  style={{ backgroundColor: channelConfig[item.channel as keyof typeof channelConfig]?.color }}
                />
                {channelConfig[item.channel as keyof typeof channelConfig]?.label ?? item.channel}
              </span>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
