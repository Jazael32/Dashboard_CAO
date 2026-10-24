import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { chartConfig, salesData } from '@/data/mock-data'
import { WorkBook } from '@/app/interfaces/DashboardInterfaces'

export const DashboardChart = (book: WorkBook) => {

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Revenue overview</CardTitle>
          <CardDescription>Monthly revenue and order volume from {book.name}.</CardDescription></div>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal />
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <BarChart accessibilityLayer data={salesData} barGap={6}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-chart-2" />Revenue</span>
          <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-chart-1" />Orders</span>
        </div>
      </CardContent>
    </Card>
  )
}
