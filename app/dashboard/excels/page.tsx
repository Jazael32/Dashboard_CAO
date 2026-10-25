'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadInput } from "@/components/excelProvider/UploadInput";
import { SavedList } from "@/components/excelProvider/SavedList";
import { ExcelProvider } from "@/components/excelProvider/ExcelProvider";


export default function ExcelPage() {

  return (
    <>
      <ExcelProvider>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Excel workbooks</CardTitle>
                <CardDescription>Upload, review permissions, and manage your source files.</CardDescription>
              </div>
              {true &&
                <UploadInput />
              }
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <SavedList />
            </div>
          </CardContent>
        </Card>
      </ExcelProvider>
    </>
  );
}