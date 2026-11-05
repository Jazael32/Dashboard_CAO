import type { Aggregation, CardWidget, ChartWidget, PieWidget } from './types';
import { parseBool } from './boolean';

type Row = Record<string, unknown>;

export function aggregate(rows: Row[], column: string | undefined, agg: Aggregation): number {
  if (agg === 'countTrue' || agg === 'countFalse') {
    if (!column) return 0;
    const target = agg === 'countTrue';
    return rows.filter((r) => parseBool(r[column]) === target).length;
  }

  if (agg === 'count' || !column) return rows.length;
  const nums = rows.map((r) => r[column]).filter((v): v is number => typeof v === 'number');
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  switch (agg) {
    case 'sum': return sum;
    case 'avg': return sum / nums.length;
    case 'min': return nums.reduce((a, b) => (b < a ? b : a));
    case 'max': return nums.reduce((a, b) => (b > a ? b : a));
  }
}

function groupRows(rows: Row[], keyOf: (r: Row) => string) {
  const map = new Map<string, Row[]>();
  for (const r of rows) {
    const k = keyOf(r);
    const list = map.get(k);
    if (list) list.push(r);
    else map.set(k, [r]);
  }
  return map;
}

const keyFor = (v: unknown, byMonth: boolean) => {
  const s = String(v ?? '').trim();
  if (!s) return '(vacío)';
  return byMonth && /^\d{4}-\d{2}/.test(s) ? s.slice(0, 7) : s;
};

export function computeCard(rows: Row[], w: CardWidget): string {
  return aggregate(rows, w.column, w.aggregation).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function computePie(rows: Row[], w: PieWidget, topN = 5) {
  const groups = groupRows(rows, (r) => keyFor(r[w.categoryColumn], false));
  const sorted = [...groups.entries()]
    .map(([name, g]) => ({ name, value: aggregate(g, w.valueColumn, w.aggregation) }))
    .sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN).reduce((acc, g) => acc + g.value, 0);
  return rest > 0 ? [...top, { name: 'Otros', value: rest }] : top;
}

// Cada punto: { x: 'categoría o mes', s0: valor serie 1, s1: valor serie 2, ... }
export function computeChart(rows: Row[], w: ChartWidget, maxCategories = 12) {
  const groups = groupRows(rows, (r) => keyFor(r[w.xColumn], w.groupByMonth));
  const data = [...groups.entries()].map(([x, g]) => {
    const point: Record<string, string | number> = { x };
    w.series.forEach((s, i) => { point[`s${i}`] = aggregate(g, s.column, s.aggregation); });
    return point;
  });
  if (w.groupByMonth) return data.sort((a, b) => String(a.x).localeCompare(String(b.x)));
  return data.sort((a, b) => Number(b.s0) - Number(a.s0)).slice(0, maxCategories);
}