import * as XLSX from 'xlsx';

export function exportRowsToXlsx(
  headers: string[],
  rows: Record<string, any>[],
  fileName: string,
) {
  if (rows.length === 0) return;

  // `header: headers` conserva el orden original de las columnas
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');

  // "ventas.xlsx" / "ventas.csv" / "ventas" → "ventas.xlsx"
  const baseName = fileName.replace(/\.(xlsx|xls|csv)$/i, '') || 'table-export';
  XLSX.writeFile(workbook, `${baseName}.xlsx`);
}