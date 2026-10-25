'use client';

import { useDataset } from './ExcelProvider';

export function StatusMessages() {
  const { loading, error } = useDataset();
  return (
    <>
      {loading && <p className="text-sm text-slate-500 animate-pulse">Processing file...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}