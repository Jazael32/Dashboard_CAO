export type ColumnType = 'number' | 'date' | 'category' | 'text';

export type ColumnProfile = {
  name: string;
  type: ColumnType;
  uniqueCount: number;
  nullCount: number;
}

export type DatasetMapping = {
  dateColumn?: string;
  valueColumn?: string;
  categoryColumn?: string;
  aggregation: 'sum' | 'avg' | 'count';
}