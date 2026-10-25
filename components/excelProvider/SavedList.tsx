// components/dataset/SavedList.tsx
'use client';

import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { useDataset } from './ExcelProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export function SavedList() {
  const { saved, removeDataset, downloadDataset } = useDataset();

  if (saved.length === 0) return null;

  function onDelete(id: string) {
    if (confirm('Delete this saved table?')) removeDataset(id);
  }

  return (
    <>
      {
        saved.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link key={item.id} href={`excels/${item.id}`}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  {/* <p className="text-xs text-muted-foreground">{filename} · {rows} rows</p> */}
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Badge variant="outline">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</Badge>
              <Button variant="outline" size="sm" onClick={() => downloadDataset(item.id)}><Download data-icon="inline-start" />Download</Button>
              {true &&
                <Button variant="ghost" size="icon" aria-label={`Delete ${item.name}`} onClick={() => void onDelete(item.id)}><Trash2 /></Button>
              }
            </div>
          </div>
        ))
      }
    </>
  );
}