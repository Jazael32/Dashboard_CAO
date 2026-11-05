export type ColumnType = 'number' | 'date' | 'category' | 'text' | 'boolean';
export type Aggregation = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'countTrue' | 'countFalse';

export type ColumnProfile = {
  name: string;
  type: ColumnType;
  uniqueCount: number;
  nullCount: number;
}


export type CardWidget = {
  id: string;
  type: 'card';
  label: string;
  column?: string; // vacío = contar filas
  aggregation: Aggregation;
  change?: string;
  details?: string;
};

export type PieWidget = {
  id: string;
  type: 'pie';
  title: string;
  categoryColumn: string;
  valueColumn?: string;
  aggregation: Aggregation;
};

export type ChartSeries = { column?: string; aggregation: Aggregation; label: string };

export type ChartWidget = {
  id: string;
  type: 'chart';
  title: string;
  xColumn: string;
  groupByMonth: boolean;
  series: ChartSeries[];
};

export type Widget = CardWidget | PieWidget | ChartWidget;