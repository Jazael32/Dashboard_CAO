'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Upload } from "lucide-react";
import { workbooks, salesData, recentRows, dashboardCardsData } from "@/data/mock-data";
import { useReducer, useRef } from "react";
import { dashboardReducer, initialState } from "@/app/reducers/DashboardReducer";
import { DashboardTable } from "@/components/info/DashboardTable";
import { DashboardPieChart } from "@/components/info/DashboardPieChart";
import { DashboardCards } from "@/components/info/DashboardCards";
import { DashboardChart } from "@/components/info/DashboardChart";
import Link from "next/link";

export default function InfoPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const uploadInput = useRef<HTMLInputElement>(null);

  // Obtener el workbook actual seleccionado (o usar uno por defecto si es 'all')
  const workbook = workbooks.find(w => w.id === state.selectedWorkbook) || workbooks[0];

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
          <Link href={'/dashboard/excels'}>
            <Button>
              <Upload data-icon="inline-start" />Upload Excel
            </Button>
          </Link>
        </div>
      </div>


      {/* CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCardsData.map((card) => (
          <DashboardCards key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        {/* CHARTS */}
        <DashboardChart {...workbook} />

        {/* PIE CHARTS */}
        <DashboardPieChart />
      </div>

      {/* TABLE */}
      <DashboardTable />

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