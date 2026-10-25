'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDatasetWorkspace } from '@/app/reducers/useDatasetWorkspace';

type DatasetContextValue = ReturnType<typeof useDatasetWorkspace>;

const ExcelContext = createContext<DatasetContextValue | null>(null);

export function ExcelProvider({ children }: { children: ReactNode }) {
  const workspace = useDatasetWorkspace();
  return (
    <ExcelContext.Provider value={workspace}>{children}</ExcelContext.Provider>
  );
}

export function useDataset() {
  const ctx = useContext(ExcelContext);
  if (!ctx) throw new Error('useDataset must be used inside <DatasetProvider>');
  return ctx;
}