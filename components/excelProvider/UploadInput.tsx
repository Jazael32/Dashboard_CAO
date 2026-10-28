'use client';

import { Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { UploadModal } from './UploadModal';

export function UploadInput() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {/* <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={onFileChange}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        Upload workbook
      </Button> */}

      <Button onClick={() => setIsOpen(true)}>
        <Upload data-icon="inline-start" />Upload workbook
      </Button>

      {
        isOpen &&
        <UploadModal isOpen={isOpen} setIsOpen={setIsOpen} />
      }

    </>
  );
}