'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardTable } from '@/components/info/DashboardTable';
import { DashboardPieChart } from '@/components/info/DashboardPieChart';
import { DashboardCards } from '@/components/info/DashboardCards';
import { DashboardChart } from '@/components/info/DashboardChart';
import { CreateWidgetModal } from '@/components/info/CreateWidgetModal';
import { listDatasets, getDataset, saveWidgets } from '@/data/db/ExcelActions';
import { computeCard, computeChart, computePie } from '@/lib/dataset/aggregate';
import type { Widget } from '@/lib/dataset/types';

type DatasetItem = Awaited<ReturnType<typeof listDatasets>>[number];
type LoadedDataset = NonNullable<Awaited<ReturnType<typeof getDataset>>>;

function WidgetFrame({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <Button variant="secondary" size="icon" aria-label="Remove component" onClick={onDelete}
        className="absolute -right-2 -top-2 z-10 size-6 opacity-0 transition-opacity group-hover:opacity-100">
        <X className="size-3" />
      </Button>
      {children}
    </div>
  );
}

export default function InfoPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dataset, setDataset] = useState<LoadedDataset | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDatasets().then((list) => {
      setDatasets(list);
      setSelectedId((prev) => prev ?? list[0]?.id ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    getDataset(selectedId).then((ds) => {
      if (cancelled || !ds) return;
      setDataset(ds);
      setWidgets(ds.widgets);
    });
    return () => { cancelled = true; };
  }, [selectedId]);

  const persist = async (next: Widget[]) => {
    if (!dataset) return;
    setWidgets(next); // optimista
    await saveWidgets(dataset.id, next);
  };

  const addWidget = (w: Widget) => persist([...widgets, w]);
  const removeWidget = (id: string) => persist(widgets.filter((w) => w.id !== id));

  if (!loading && datasets.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-muted-foreground">Aún no tienes workbooks guardados.</p>
        <Link href="/dashboard/excels"><Button>Upload Excel</Button></Link>
      </div>
    );
  }

  const rows = dataset?.rows ?? [];
  const cards = widgets.filter((w) => w.type === 'card');
  const charts = widgets.filter((w) => w.type !== 'card');

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, Jazael Moreno</h2>
          <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening across your workbooks.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedId ?? ''} onValueChange={(v) => v && setSelectedId(v)}>
            <SelectTrigger className="w-52.5 bg-background"><SelectValue placeholder="Select workbook" /></SelectTrigger>
            <SelectContent>
              {datasets.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={!dataset} onClick={() => setModalOpen(true)}>
            <Plus data-icon="inline-start" />Create component
          </Button>
          <Link href="/dashboard/excels">
            <Button><Upload data-icon="inline-start" />Upload Excel</Button>
          </Link>
        </div>
      </div>

      {dataset && widgets.length === 0 && (
        <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          Este workbook aún no tiene componentes. Usa &quot;Create component&quot; para agregar una card, un chart o un pie chart.
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((w) => w.type === 'card' && (
            <WidgetFrame key={w.id} onDelete={() => removeWidget(w.id)}>
              <DashboardCards label={w.label} value={computeCard(rows, w)} change={w.change} details={w.details} />
            </WidgetFrame>
          ))}
        </div>
      )}

      {charts.length > 0 && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {charts.map((w) => (
            <WidgetFrame key={w.id} onDelete={() => removeWidget(w.id)}>
              {w.type === 'chart' && dataset && (
                <DashboardChart title={w.title} datasetName={dataset.name} series={w.series} data={computeChart(rows, w)} />
              )}
              {w.type === 'pie' && <DashboardPieChart title={w.title} data={computePie(rows, w)} />}
            </WidgetFrame>
          ))}
        </div>
      )}

      {dataset && <DashboardTable name={dataset.name} columns={dataset.columns} rows={dataset.rows} />}

      <div className="mt-8 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Showing data from <span className="font-medium text-foreground">{dataset?.name}</span></p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2"><ShieldCheck className="size-4" />Secure workspace</span>
          {dataset && <span>Last updated {new Date(dataset.updatedAt).toLocaleString()}</span>}
        </div>
      </div>

      {dataset && (
        <CreateWidgetModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
          profile={dataset.profile} onCreate={addWidget} />
      )}
    </>
  );
}