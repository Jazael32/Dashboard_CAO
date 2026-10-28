import type { ColumnProfile, ColumnType, DatasetMapping } from './types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

export function profileColumns(
  columns: string[],
  rows: Record<string, unknown>[],
): ColumnProfile[] {
  return columns.map((name) => {
    const values = rows
      .map((r) => r[name])
      .filter((v) => v !== null && v !== undefined && v !== '');
    const unique = new Set(values.map(String));

    let type: ColumnType = 'text';
    if (values.length > 0 && values.every((v) => typeof v === 'number')) {
      type = 'number';
    } else if (values.length > 0 && values.every((v) => typeof v === 'string' && ISO_DATE.test(v))) {
      type = 'date';
    } else if (unique.size <= 20 || unique.size / Math.max(values.length, 1) < 0.05) {
      type = 'category';
    }

    return {
      name,
      type,
      uniqueCount: unique.size,
      nullCount: rows.length - values.length,
    };
  });
}

export function suggestMapping(profile: ColumnProfile[]): DatasetMapping {
  return {
    dateColumn: profile.find((c) => c.type === 'date')?.name,
    valueColumn: profile.find((c) => c.type === 'number')?.name,
    categoryColumn: profile.find((c) => c.type === 'category')?.name,
    aggregation: 'sum',
  };
}