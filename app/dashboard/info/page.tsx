'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, MoreHorizontal, Search, ShieldCheck, Upload } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";
import { chartConfig, channelConfig, workbooks, salesData, channelData, recentRows } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReducer, useRef } from "react";
import { dashboardReducer, initialState } from "@/app/reducers/DashboardReducer";

export default function InfoPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const uploadInput = useRef<HTMLInputElement>(null);

  // Obtener el workbook actual seleccionado (o usar uno por defecto si es 'all')
  const workbook = workbooks.find(w => w.id === state.selectedWorkbook) || workbooks[0];

  // Datos para la gráfica (puedes personalizarlos según el workbook si gustas)
  const liveChartData = salesData;

  // Filtrar las filas de la tabla según el buscador
  const filteredRows = recentRows.filter(row =>
    row.customer.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    row.product.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const uploadWorkbook = (file: File) => {
    console.log("Subiendo archivo:", file.name);
    // Lógica para subir archivo
  };

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Tuesday, September 26, 2024</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, {'Jazael Moreno'}</h2>
          <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening across your workbooks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={state.selectedWorkbook} onValueChange={(value) => { if (value) dispatch({ type: 'SET_SELECTED_WORKBOOK', payload: value }) }}>
            <SelectTrigger className="w-52.5 bg-background">
              <SelectValue placeholder="Select workbook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workbooks</SelectItem>
              {workbooks.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}
              </SelectItem>)}
            </SelectContent>
          </Select>
          <input ref={uploadInput} type="file" accept=".xlsx" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadWorkbook(file); event.target.value = '' }} />
          <Button onClick={() => dispatch({ type: 'SET_ACTIVE_SECTION', payload: 'Excels' })}>
            <Upload data-icon="inline-start" />Upload Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value="$284,690" change="+12.8%" detail="vs. previous period" />
        <MetricCard label="Total orders" value="8,429" change="+8.2%" detail="vs. previous period" />
        <MetricCard label="Active workbooks" value="12" change="+2" detail="this month" />
        <MetricCard label="Data rows" value="24,681" change="+18.4%" detail="across all workbooks" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <CardDescription>Monthly revenue and order volume from {workbook.name}.</CardDescription></div>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreHorizontal />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-70 w-full">
              <BarChart accessibilityLayer data={liveChartData} barGap={6}>
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
                  strokeWidth={4}>
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {channelData.map((item) =>
                <div key={item.channel} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <i className="size-2 rounded-full" style={{ backgroundColor: item.fill.replace('var(--color-', 'var(--chart-').replace(')', '') }} />
                    {item.channel}
                  </span>
                  <span className="font-medium">{item.value}%</span>
                </div>)
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent data</CardTitle>
            <CardDescription>Rows imported from {workbook.name}.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={state.searchTerm} onChange={(event) => dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value })} placeholder="Search rows..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  filteredRows.map((row) =>
                    <TableRow key={row.customer}>
                      <TableCell className="font-medium">{row.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{row.region}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell><Badge variant={row.status === 'Complete' ? 'secondary' : 'outline'}>{row.status}</Badge></TableCell>
                      <TableCell className="text-right"> <Button variant="ghost" size="sm"> <Download data-icon="inline-start" />Download</Button></TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Showing data from <span className="font-medium text-foreground">{'filename' in workbook ? (workbook as any).filename : workbook.file}</span></p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2"><ShieldCheck className="size-4" />Secure workspace</span>
          <span>Last synced 4 min ago</span>
        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value, change, detail }: { label: string; value: string; change: string; detail: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Badge variant="secondary" className="font-medium">{change}</Badge>
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>)
}