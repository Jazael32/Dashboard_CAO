// components/dataset/DatasetGrid.tsx
'use client';

import { ExcelDataGrid } from '@/components/table/ExcelDataGrid';
import { useEditableDataset } from '@/app/reducers/useEditableDataset';
import type { Row } from '@/app/reducers/DatasetReducer';

interface DatasetEditorProps {
  id: string;
  headers: string[];
  rows: Row[];
}

export function ExcelGrid({ id, headers, rows }: DatasetEditorProps) {
  const { data, dirty, saveStatus, error, editCell, deleteRows, saveChanges } =
    useEditableDataset(id, headers, rows);

  const saving = saveStatus === 'saving';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={saveChanges}
          disabled={!dirty || saving}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>

        {dirty && !saving && <span className="text-sm text-amber-600">Unsaved changes</span>}
        {!dirty && saveStatus === 'saved' && (
          <span className="text-sm text-emerald-600">All changes saved</span>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <ExcelDataGrid
        headers={headers}
        data={data}
        onCellEdit={editCell}
        onDeleteRows={deleteRows}
      />
    </div>
  );
}