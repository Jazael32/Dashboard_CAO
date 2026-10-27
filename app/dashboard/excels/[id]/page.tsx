import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { getDataset } from '@/data/db/ExcelActions';
import { ExcelGrid } from '@/components/excelProvider/ExcelGrid'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function DatasetContent({ params }: { params: Promise<{ id: string }> }) {
  await connection(); // marca este componente como "por petición"

  const { id } = await params;
  if (!UUID_REGEX.test(id)) notFound();

  const dataset = await getDataset(id);
  if (!dataset) notFound();

  return (
    <ExcelGrid
      key={dataset.id}
      id={dataset.id}
      headers={dataset.columns as string[]}
      rows={dataset.rows as Record<string, any>[]}
    />
  );
}

export default function DatasetPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link
        href="/dashboard/excels"
        aria-label="Volver"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>

      <Suspense fallback={<p className="text-sm text-slate-500 animate-pulse">Loading table...</p>}>
        <DatasetContent params={params} />
      </Suspense>
    </div>
  );
}