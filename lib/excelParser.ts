import * as XLSX from 'xlsx';
import { normalizeCell } from './normalize';
import { profileColumns } from '@/lib/dataset/profile';
import type { ColumnProfile } from '@/lib/dataset/types';

export interface AdvancedParsedExcel {
  sheetNames: string[];
  headers: string[];
  data: Record<string, any>[];
  headerRowIndex: number;
  profile: ColumnProfile[];
}

export async function parseExcelAdvanced(
  file: File,
  sheetName?: string,
  headerKeyword?: string,
  stopOnEmptyColumn?: string
): Promise<AdvancedParsedExcel> {

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetNames = workbook.SheetNames;

  const targetSheetName = sheetName || sheetNames[0];
  const worksheet = workbook.Sheets[targetSheetName];

  if (!worksheet) {
    throw new Error(`Sheet "${targetSheetName}" not found.`);
  }

  // 1. Hoja -> matriz 2D
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: ''
  });


  // 2. Buscar la fila de headers
  let headerRowIndex = -1;
  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];

    if (headerKeyword) {
      const found = row.some(cell =>
        String(cell).toLowerCase().includes(headerKeyword.toLowerCase())
      );
      if (found) {
        headerRowIndex = i;
        break;
      }
    } else {
      const filledCount = row.filter(cell => cell !== '' && cell != null).length;
      if (filledCount >= 2) {
        headerRowIndex = i;
        break;
      }
    }
  }

  if (headerRowIndex === -1) {
    throw new Error('Could not automatically find a valid header row in the spreadsheet.');
  }

  // 3. Headers limpios y sin duplicados mismo "name" name, name1, name2, etc.
  const seen = new Map<string, number>();
  const headerCols = rawRows[headerRowIndex]
    .map((cell, index) => ({ name: String(cell).trim(), index }))
    .filter((col) => col.name)
    .map((col) => {
      const count = seen.get(col.name) ?? 0;
      seen.set(col.name, count + 1);
      return count === 0 ? col : { ...col, name: `${col.name} (${count + 1})` };
    });

  const headers = headerCols.map((col) => col.name);

  const stopColumnIndex = stopOnEmptyColumn
    ? (headerCols.find((col) => col.name === stopOnEmptyColumn)?.index ?? -1)
    : -1;

  // 4. Slice all rows below the header row
  const dataRows = rawRows.slice(headerRowIndex + 1);
  const data: Record<string, any>[] = [];

  // 5. Map row cells using the original index
  for (const row of dataRows) {
    if (stopColumnIndex !== -1) {
      const cellValue = row[stopColumnIndex];
      if (cellValue === undefined || cellValue === null || String(cellValue).trim() === '') {
        break;
      }
    }

    // Saltar filas vacias
    if (row.every((cell) => cell === '' || cell == null)) {
      continue;
    }

    // Map row cells using the original index
    const obj: Record<string, any> = {};
    for (const { name, index } of headerCols) {
      obj[name] = normalizeCell(row[index]);
    }

    data.push(obj);
  }

  return {
    sheetNames,
    headers,
    data,
    headerRowIndex,
    profile: profileColumns(headers, data)
  };
}