'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Download, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { recentRows, workbooks } from '@/data/mock-data'
import { dashboardReducer, initialState } from '@/app/reducers/DashboardReducer'
import { useReducer } from 'react'

export const DashboardTable = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Obtener el workbook actual seleccionado (o usar uno por defecto si es 'all')
  const workbook = workbooks.find(w => w.id === state.selectedWorkbook) || workbooks[0];

  const filteredRows = recentRows.filter(row =>
    row.customer.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    row.product.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent data</CardTitle>
          <CardDescription>Rows imported from {workbook.name}.</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={state.searchTerm} onChange={(event) => dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value })} placeholder="Search rows..." className="pl-9" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                filteredRows.map((row) =>
                  <TableRow key={row.customer}>
                    <TableCell className="font-medium">{row.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{row.region}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell><Badge variant={row.status === 'Complete' ? 'secondary' : 'outline'}>{row.status}</Badge></TableCell>
                    <TableCell className="text-right"> <Button variant="ghost" size="sm"> <Download data-icon="inline-start" />Download</Button></TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
