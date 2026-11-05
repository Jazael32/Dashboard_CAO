'use client';

import { useMemo } from 'react';
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  FlexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type Row = Record<string, unknown>;

// Se define FUERA del componente para que sea estable entre renders
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

interface DashboardTableProps {
  name: string;
  columns: string[];
  rows: Row[];
}

function formatCell(value: unknown) {
  if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return String(value ?? '');
}

export const DashboardTable = ({ name, columns, rows }: DashboardTableProps) => {
  const tableColumns = useMemo<ColumnDef<typeof features, Row>[]>(
    () =>
      columns.map((c) => ({
        id: c,
        accessorFn: (row: Row) => row[c],
        header: c,
        cell: ({ cell }) => formatCell(cell.getValue()),
      })),
    [columns],
  );

  const table = useTable({
    features,
    columns: tableColumns,
    data: rows,
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const { pagination, globalFilter } = table.state;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent data</CardTitle>
          <CardDescription>Rows imported from {name}.</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(globalFilter as string) ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder="Search rows..."
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      <FlexRender header={h} />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)} ·{' '}
            {table.getFilteredRowModel().rows.length} rows
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};