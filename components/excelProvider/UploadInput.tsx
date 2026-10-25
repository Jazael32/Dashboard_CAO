'use client';

import { Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { useDataset } from './ExcelProvider';
import { useRef } from 'react';

export function UploadInput() {
  const { onFileChange } = useDataset();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={onFileChange}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        Upload workbook
      </Button>
    </>
  );
}