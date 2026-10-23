'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workbooks } from "@/data/mock-data";
import { Download, FileSpreadsheet, Trash2, Upload } from "lucide-react";
import { useRef } from "react";

export default function ExcelPage() {

  const onDelete = () => {
    console.log('Delete');
  }

  const onUpload = () => {
    console.log('Upload');
  }

  const input = useRef<HTMLInputElement>(null)
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Excel workbooks</CardTitle>
              <CardDescription>Upload, review permissions, and manage your source files.</CardDescription>
            </div>
            {true &&
              <>
                <input ref={input} type="file" accept=".xlsx" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(); event.target.value = '' }} />
                <Button onClick={() => input.current?.click()}>
                  <Upload data-icon="inline-start" />
                  Upload workbook
                </Button>
              </>
            }
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {workbooks.map((item) => {
              const filename = 'filename' in item ? item.filename : item.file;
              //TODO PONER ROWS DESPUES AQUI CON EL FORMATO CORRECTO
              // const rows = 'rowCount' in item ? item.rowCount.toLocaleString() : item.rows;
              return (
                <div key={item.id} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                      <FileSpreadsheet className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {/* <p className="text-xs text-muted-foreground">{filename} · {rows} rows</p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    //TODO PONER LA FECHA DE CREACION DESPUES
                    {/* <Badge variant="outline">{('createdAt' in item ? new Date(item.createdAt).toLocaleDateString() : item.updated)}</Badge> */}
                    <Button variant="outline" size="sm"><Download data-icon="inline-start" />Download</Button>
                    {true &&
                      <Button variant="ghost" size="icon" aria-label={`Delete ${item.name}`} onClick={() => void onDelete()}><Trash2 /></Button>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}