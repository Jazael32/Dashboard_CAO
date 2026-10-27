import React, { Dispatch, SetStateAction, SubmitEvent, useRef, useState } from 'react'
import { useDataset } from './ExcelProvider';
import { FileSpreadsheet } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const UploadModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const input = useRef<HTMLInputElement>(null);
  const { uploadWorkbook, error } = useDataset();
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [tableHeader, setTableHeader] = useState('')
  const [stopOnColumn, setStopOnColumn] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const close = () => {
    if (isUploading)
      return;
    setIsOpen(false);
    setFile(null);
    setName('');
    setTableHeader('');
    setStopOnColumn('')
  }

  const chooseFile = (selected: File | undefined) => {
    if (!selected) return;
    setFile(selected);
    setName(selected.name.replace(/\.xlsx$/i, ''))
  }

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file || !name.trim()) return
    setIsUploading(true)
    try {
      await uploadWorkbook({
        file,
        name: name.trim(),
        tableHeader: tableHeader.trim(),
        stopOnColumn: stopOnColumn.trim(),
      });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
    finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="upload-workbook-title"
        className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl">
        <div className="mb-6">
          <h2 id="upload-workbook-title" className="text-lg font-semibold">Upload workbook</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add an Excel file and define how its table should be read.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="workbook-file">Excel file</label>
            <input ref={input} id="workbook-file" type="file" accept=".xlsx" className="sr-only" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = '' }} />
            <button type="button" onClick={() => input.current?.click()} className="flex w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left hover:bg-muted">
              <FileSpreadsheet className="size-5 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm">{file?.name ?? 'Choose an .xlsx file'}</span>
              <span className="text-sm font-medium text-primary">Browse</span>
            </button>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="workbook-name">Name</label>
            <Input id="workbook-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Workbook name" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="table-header">Table Header</label>
              <Input id="table-header" value={tableHeader} onChange={(event) => setTableHeader(event.target.value)} placeholder="Table Header" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="stop-on-column">Stop on Column</label>
              <Input id="stop-on-column" value={stopOnColumn} onChange={(event) => setStopOnColumn(event.target.value)} placeholder="Stop Column" />
            </div>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="mb-2 block text-sm font-medium text-yellow-500">Se exacto con el Header y Stop "Mayusculas y Minusculas"</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit" disabled={!file || !name.trim() || isUploading}>{isUploading ? 'Uploading...' : 'Upload workbook'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
