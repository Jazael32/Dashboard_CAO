'use client';

import { useState } from 'react';
import { BarChart3, LayoutGrid, PieChart, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Aggregation, ChartSeries, ColumnProfile, Widget } from '@/lib/dataset/types';

type Kind = 'card' | 'pie' | 'chart';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ColumnProfile[];
  onCreate: (widget: Widget) => Promise<void> | void;
}

const NONE = '__none__';
const AGGS: { value: Aggregation; label: string }[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count rows' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'countTrue', label: 'Count Yes / True' },
  { value: 'countFalse', label: 'Count No / False' },
];

const isBoolAgg = (a: Aggregation) => a === 'countTrue' || a === 'countFalse';

function ColumnSelect({ label, value, options, onChange, allowNone }: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string | undefined) => void;
  allowNone?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <Select value={value ?? (allowNone ? NONE : '')} onValueChange={(v) => onChange(!v || v === NONE ? undefined : v)}>
        <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select column" /></SelectTrigger>
        <SelectContent>
          {allowNone && <SelectItem value={NONE}>None</SelectItem>}
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function AggSelect({ value, onChange }: { value: Aggregation; onChange: (v: Aggregation) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Operation</label>
      <Select value={value} onValueChange={(v) => v && onChange(v as Aggregation)}>
        <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
        <SelectContent>
          {AGGS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

const emptySeries = (): ChartSeries => ({ column: undefined, aggregation: 'sum', label: '' });

export const CreateWidgetModal = ({ isOpen, onClose, profile, onCreate }: Props) => {
  const [kind, setKind] = useState<Kind | ''>('');
  const [saving, setSaving] = useState(false);

  // comunes
  const [title, setTitle] = useState('');
  const [aggregation, setAggregation] = useState<Aggregation>('sum');
  const [valueColumn, setValueColumn] = useState<string | undefined>();
  // card
  const [change, setChange] = useState('');
  const [details, setDetails] = useState('');
  // pie
  const [categoryColumn, setCategoryColumn] = useState<string | undefined>();
  // chart
  const [xColumn, setXColumn] = useState<string | undefined>();
  const [groupByMonth, setGroupByMonth] = useState(true);
  const [series, setSeries] = useState<ChartSeries[]>([emptySeries()]);

  const allColumns = profile.map((c) => c.name);
  const numberColumns = profile.filter((c) => c.type === 'number').map((c) => c.name);
  const booleanColumns = profile.filter((c) => c.type === 'boolean').map((c) => c.name);
  const columnsFor = (a: Aggregation) => (isBoolAgg(a) ? booleanColumns : numberColumns);
  const xIsDate = profile.find((c) => c.name === xColumn)?.type === 'date';

  const reset = () => {
    setKind(''); setTitle(''); setAggregation('sum'); setValueColumn(undefined);
    setChange(''); setDetails(''); setCategoryColumn(undefined);
    setXColumn(undefined); setGroupByMonth(true); setSeries([emptySeries()]);
  };

  const close = () => { if (saving) return; reset(); onClose(); };

  const needsColumn = aggregation !== 'count';
  const seriesValid = series.every((s) => s.aggregation === 'count' || s.column);
  const canSave =
    (kind === 'card' && title.trim() && (!needsColumn || valueColumn)) ||
    (kind === 'pie' && title.trim() && categoryColumn && (!needsColumn || valueColumn)) ||
    (kind === 'chart' && title.trim() && xColumn && series.length > 0 && seriesValid);

  const buildWidget = (): Widget | null => {
    const id = crypto.randomUUID();
    if (kind === 'card')
      return {
        id, type: 'card', label: title.trim(), column: valueColumn, aggregation,
        change: change.trim() || undefined, details: details.trim() || undefined
      };
    if (kind === 'pie' && categoryColumn)
      return { id, type: 'pie', title: title.trim(), categoryColumn, valueColumn, aggregation };
    if (kind === 'chart' && xColumn)
      return {
        id, type: 'chart', title: title.trim(), xColumn, groupByMonth: xIsDate && groupByMonth,
        series: series.map((s) => ({
          ...s,
          label:
            s.aggregation === 'countTrue' ? `${s.column} (Yes)` :
              s.aggregation === 'countFalse' ? `${s.column} (No)` :
                s.column ?? 'Count',
        })),
      };
    return null;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const widget = buildWidget();
    if (!widget) return;
    setSaving(true);
    try {
      await onCreate(widget);
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const updateSeries = (i: number, patch: Partial<ChartSeries>) =>
    setSeries((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  if (!isOpen) return null;

  const kinds: { id: Kind; label: string; icon: typeof BarChart3 }[] = [
    { id: 'card', label: 'Card', icon: LayoutGrid },
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'pie', label: 'Pie chart', icon: PieChart },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-background p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Create component</h2>
          <p className="mt-1 text-sm text-muted-foreground">Build a component from this workbook&apos;s columns.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">What do you want to create?</label>
            <div className="grid grid-cols-3 gap-2">
              {kinds.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setKind(id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted ${kind === id ? 'border-primary bg-muted' : ''}`}>
                  <Icon className="size-5" />{label}
                </button>
              ))}
            </div>
          </div>

          {kind && (
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="widget-title">
                {kind === 'card' ? 'Label' : 'Title'}
              </label>
              <Input id="widget-title" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder={kind === 'card' ? 'Total sales' : 'Sales by region'} />
            </div>
          )}

          {kind === 'card' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <AggSelect value={aggregation} onChange={(v) => { setAggregation(v); setValueColumn(undefined); }} />
                {needsColumn && (
                  <ColumnSelect label="Column" value={valueColumn} options={columnsFor(aggregation)} onChange={setValueColumn} />
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="widget-change">Change (optional)</label>
                  <Input id="widget-change" value={change} onChange={(e) => setChange(e.target.value)} placeholder="+12%" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="widget-details">Details (optional)</label>
                  <Input id="widget-details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="vs last month" />
                </div>
              </div>
            </>
          )}

          {kind === 'pie' && (
            <>
              <ColumnSelect label="Group by (category)" value={categoryColumn} options={allColumns} onChange={setCategoryColumn} />
              <div className="grid gap-4 sm:grid-cols-2">
                <AggSelect value={aggregation} onChange={(v) => { setAggregation(v); setValueColumn(undefined); }} />
                {needsColumn && (
                  <ColumnSelect label="Value column" value={valueColumn} options={columnsFor(aggregation)} onChange={setValueColumn} />
                )}
              </div>
            </>
          )}

          {kind === 'chart' && (
            <>
              <ColumnSelect label="X axis" value={xColumn} options={allColumns} onChange={setXColumn} />
              {xIsDate && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={groupByMonth} onChange={(e) => setGroupByMonth(e.target.checked)} />
                  Group dates by month
                </label>
              )}
              <div className="space-y-3">
                <p className="text-sm font-medium">Metrics to track</p>
                {series.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                    <AggSelect value={s.aggregation} onChange={(v) => updateSeries(i, { aggregation: v, column: undefined })} />
                    {s.aggregation !== 'count' ? (
                      <ColumnSelect label="Column" value={s.column} options={columnsFor(s.aggregation)}
                        onChange={(v) => updateSeries(i, { column: v })} />
                    ) : <div />}
                    <Button type="button" variant="ghost" size="icon" disabled={series.length === 1}
                      onClick={() => setSeries((prev) => prev.filter((_, idx) => idx !== i))}>
                      <X />
                    </Button>
                  </div>
                ))}
                {series.length < 4 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setSeries((p) => [...p, emptySeries()])}>
                    <Plus data-icon="inline-start" />Add metric
                  </Button>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit" disabled={!canSave || saving}>{saving ? 'Saving...' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};