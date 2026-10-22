'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Bell,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Files,
  LayoutDashboard,
  MoreHorizontal,
  Moon,
  Search,
  Sun,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const workbooks = [
  { id: 'sales', name: 'Q3 Sales Overview', file: 'q3-sales-overview.xlsx', rows: '1,248', updated: 'Today, 09:42 AM', size: '2.4 MB', color: 'var(--chart-2)' },
  { id: 'inventory', name: 'Inventory & Stock', file: 'inventory-stock.xlsx', rows: '842', updated: 'Yesterday, 04:18 PM', size: '1.8 MB', color: 'var(--chart-3)' },
  { id: 'marketing', name: 'Marketing Performance', file: 'marketing-performance.xlsx', rows: '386', updated: 'Sep 24, 2024', size: '986 KB', color: 'var(--chart-4)' },
]

const salesData = [
  { month: 'Jan', revenue: 42, orders: 25 }, { month: 'Feb', revenue: 48, orders: 30 }, { month: 'Mar', revenue: 57, orders: 36 },
  { month: 'Apr', revenue: 52, orders: 33 }, { month: 'May', revenue: 68, orders: 44 }, { month: 'Jun', revenue: 74, orders: 49 },
  { month: 'Jul', revenue: 81, orders: 55 }, { month: 'Aug', revenue: 77, orders: 52 }, { month: 'Sep', revenue: 94, orders: 63 },
]

const channelData = [
  { channel: 'Direct', value: 42, fill: 'var(--color-direct)' },
  { channel: 'Organic', value: 28, fill: 'var(--color-organic)' },
  { channel: 'Referral', value: 18, fill: 'var(--color-referral)' },
  { channel: 'Paid', value: 12, fill: 'var(--color-paid)' },
]

const recentRows = [
  { customer: 'Northstar Labs', region: 'North America', product: 'Enterprise', amount: '$18,420', status: 'Complete' },
  { customer: 'Morrow & Co.', region: 'Europe', product: 'Growth', amount: '$12,840', status: 'Complete' },
  { customer: 'Kite Systems', region: 'Asia Pacific', product: 'Enterprise', amount: '$9,280', status: 'Pending' },
  { customer: 'Lumen Studio', region: 'North America', product: 'Starter', amount: '$4,620', status: 'Complete' },
  { customer: 'Atlas Goods', region: 'Latin America', product: 'Growth', amount: '$3,980', status: 'Review' },
]

const chartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-2)' },
  orders: { label: 'Orders', color: 'var(--chart-1)' },
}
const channelConfig = {
  direct: { label: 'Direct', color: 'var(--chart-2)' },
  organic: { label: 'Organic', color: 'var(--chart-3)' },
  referral: { label: 'Referral', color: 'var(--chart-4)' },
  paid: { label: 'Paid', color: 'var(--chart-5)' },
}

const fetcher = (url: string) => fetch(url).then((response) => response.json())

type WorkbookRecord = { id: string; name: string; filename: string; rowCount: number; createdAt: string; canDownload?: boolean }
type WorkbookData = WorkbookRecord & { headers: string[]; rows: Record<string, unknown>[] }

type DashboardUser = { name: string; email: string; role: string }

export function ExcelDashboard({ user }: { user: DashboardUser }) {
  const isAdmin = user.role === 'admin'
  const [selectedWorkbook, setSelectedWorkbook] = useState('all')
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const uploadInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark') || (!document.documentElement.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches))
  }, [])

  const toggleTheme = () => {
    const nextIsDarkMode = !isDarkMode
    document.documentElement.classList.toggle('dark', nextIsDarkMode)
    document.documentElement.classList.toggle('light', !nextIsDarkMode)
    setIsDarkMode(nextIsDarkMode)
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      {/* Aside here */}
      <div className="lg:pl-64">
        {/* Header here */}

        {/* <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {activeSection === 'Excels' ? <ExcelFilesSection workbooks={liveWorkbooks} onUpload={uploadWorkbook} onDelete={deleteWorkbook} isAdmin={isAdmin} /> : activeSection === 'Users' && isAdmin ? <UsersSection /> : <>
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-muted-foreground">Tuesday, September 26, 2024</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, {user.name.split(' ')[0]}</h2><p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening across your workbooks.</p></div><div className="flex items-center gap-3"><Select value={selectedWorkbook} onValueChange={(value) => { if (value) setSelectedWorkbook(value) }}><SelectTrigger className="w-[210px] bg-background"><SelectValue placeholder="Select workbook" /></SelectTrigger><SelectContent><SelectItem value="all">All workbooks</SelectItem>{workbooks.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select><input ref={uploadInput} type="file" accept=".xlsx" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadWorkbook(file); event.target.value = '' }} /><Button onClick={() => setActiveSection('Excels')}><Upload data-icon="inline-start" />Upload Excel</Button></div></div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total revenue" value="$284,690" change="+12.8%" detail="vs. previous period" /><MetricCard label="Total orders" value="8,429" change="+8.2%" detail="vs. previous period" /><MetricCard label="Active workbooks" value="12" change="+2" detail="this month" /><MetricCard label="Data rows" value="24,681" change="+18.4%" detail="across all workbooks" /></div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]"><Card><CardHeader className="flex flex-row items-start justify-between space-y-0"><div><CardTitle>Revenue overview</CardTitle><CardDescription>Monthly revenue and order volume from {workbook.name}.</CardDescription></div><Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal /></Button></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[280px] w-full"><BarChart accessibilityLayer data={liveChartData} barGap={6}><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} /><YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}k`} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} /><Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} /></BarChart></ChartContainer><div className="mt-4 flex justify-center gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-chart-2" />Revenue</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-chart-1" />Orders</span></div></CardContent></Card><Card><CardHeader><CardTitle>Sales by channel</CardTitle><CardDescription>Where your revenue is coming from.</CardDescription></CardHeader><CardContent><ChartContainer config={channelConfig} className="mx-auto h-[220px] max-w-[280px]"><PieChart><ChartTooltip content={<ChartTooltipContent hideLabel />} /><Pie data={channelData} dataKey="value" nameKey="channel" innerRadius={62} outerRadius={90} strokeWidth={4}>{channelData.map((entry) => <Cell key={entry.channel} fill={entry.fill} />)}</Pie></PieChart></ChartContainer><div className="grid grid-cols-2 gap-3 pt-2">{channelData.map((item) => <div key={item.channel} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><i className="size-2 rounded-full" style={{ backgroundColor: item.fill.replace('var(--color-', 'var(--chart-').replace(')', '') }} />{item.channel}</span><span className="font-medium">{item.value}%</span></div>)}</div></CardContent></Card></div>

          <Card className="mt-6"><CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Recent data</CardTitle><CardDescription>Rows imported from {workbook.name}.</CardDescription></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search rows..." className="pl-9" /></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Region</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filteredRows.map((row) => <TableRow key={row.customer}><TableCell className="font-medium">{row.customer}</TableCell><TableCell className="text-muted-foreground">{row.region}</TableCell><TableCell>{row.product}</TableCell><TableCell>{row.amount}</TableCell><TableCell><Badge variant={row.status === 'Complete' ? 'secondary' : 'outline'}>{row.status}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm"><Download data-icon="inline-start" />Download</Button></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>

          <div className="mt-8 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>Showing data from <span className="font-medium text-foreground">{'filename' in workbook ? workbook.filename : workbook.file}</span></p><div className="flex items-center gap-4"><span className="flex items-center gap-2"><ShieldCheck className="size-4" />Secure workspace</span><span>Last synced 4 min ago</span></div></div>
          </>}
        </main> */}
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, detail }: { label: string; value: string; change: string; detail: string }) {
  return <Card><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Badge variant="secondary" className="font-medium">{change}</Badge></div><p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>
}

export function ExcelFilesSection({ workbooks: items, onUpload, onDelete, isAdmin }: { workbooks: Array<WorkbookRecord | typeof workbooks[number]>; onUpload: (file: File) => Promise<void>; onDelete: (id: string) => Promise<void>; isAdmin: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  return <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>Excel workbooks</CardTitle><CardDescription>Upload, review permissions, and manage your source files.</CardDescription></div>{isAdmin && <><input ref={input} type="file" accept=".xlsx" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(file); event.target.value = '' }} /><Button onClick={() => input.current?.click()}><Upload data-icon="inline-start" />Upload workbook</Button></>}</div></CardHeader><CardContent><div className="flex flex-col gap-3">{items.map((item) => { const filename = 'filename' in item ? item.filename : item.file; const rows = 'rowCount' in item ? item.rowCount.toLocaleString() : item.rows; return <div key={item.id} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-secondary"><FileSpreadsheet className="size-5" /></div><div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{filename} · {rows} rows</p></div></div><div className="flex items-center gap-2 sm:ml-auto"><Badge variant="outline">{('createdAt' in item ? new Date(item.createdAt).toLocaleDateString() : item.updated)}</Badge><Button variant="outline" size="sm"><Download data-icon="inline-start" />Download</Button>{isAdmin && <Button variant="ghost" size="icon" aria-label={`Delete ${item.name}`} onClick={() => void onDelete(item.id)}><Trash2 /></Button>}</div></div> })}</div></CardContent></Card>
}

export function UsersSection() {
  const users = [{ name: 'Jordan Davis', email: 'jordan@sheetwise.co', role: 'Admin', access: 'All workbooks' }, { name: 'Maya Chen', email: 'maya@northstar.co', role: 'User', access: '2 workbooks' }, { name: 'Elliot Stone', email: 'elliot@lumen.studio', role: 'User', access: '1 workbook' }]
  return <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Team members</CardTitle><CardDescription>Manage access to your workbook data.</CardDescription></div><Button><Users data-icon="inline-start" />Create user</Button></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Workbook access</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{users.map((user) => <TableRow key={user.email}><TableCell><div><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div></TableCell><TableCell><Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>{user.role}</Badge></TableCell><TableCell>{user.access}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm">Manage access</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
}