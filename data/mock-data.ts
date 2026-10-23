export const workbooks = [
  { id: 'sales', name: 'Q3 Sales Overview', file: 'q3-sales-overview.xlsx', rows: '1,248', updated: 'Today, 09:42 AM', size: '2.4 MB', color: 'var(--chart-2)' },
  { id: 'inventory', name: 'Inventory & Stock', file: 'inventory-stock.xlsx', rows: '842', updated: 'Yesterday, 04:18 PM', size: '1.8 MB', color: 'var(--chart-3)' },
  { id: 'marketing', name: 'Marketing Performance', file: 'marketing-performance.xlsx', rows: '386', updated: 'Sep 24, 2024', size: '986 KB', color: 'var(--chart-4)' },
]

export const salesData = [
  { month: 'Jan', revenue: 42, orders: 25 }, { month: 'Feb', revenue: 48, orders: 30 }, { month: 'Mar', revenue: 57, orders: 36 },
  { month: 'Apr', revenue: 52, orders: 33 }, { month: 'May', revenue: 68, orders: 44 }, { month: 'Jun', revenue: 74, orders: 49 },
  { month: 'Jul', revenue: 81, orders: 55 }, { month: 'Aug', revenue: 77, orders: 52 }, { month: 'Sep', revenue: 94, orders: 63 },
]

export const channelData = [
  { channel: 'Direct', value: 42, fill: 'var(--color-direct)' },
  { channel: 'Organic', value: 28, fill: 'var(--color-organic)' },
  { channel: 'Referral', value: 18, fill: 'var(--color-referral)' },
  { channel: 'Paid', value: 12, fill: 'var(--color-paid)' },
]

export const recentRows = [
  { customer: 'Northstar Labs', region: 'North America', product: 'Enterprise', amount: '$18,420', status: 'Complete' },
  { customer: 'Morrow & Co.', region: 'Europe', product: 'Growth', amount: '$12,840', status: 'Complete' },
  { customer: 'Kite Systems', region: 'Asia Pacific', product: 'Enterprise', amount: '$9,280', status: 'Pending' },
  { customer: 'Lumen Studio', region: 'North America', product: 'Starter', amount: '$4,620', status: 'Complete' },
  { customer: 'Atlas Goods', region: 'Latin America', product: 'Growth', amount: '$3,980', status: 'Review' },
]

export const chartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-2)' },
  orders: { label: 'Orders', color: 'var(--chart-1)' },
}
export const channelConfig = {
  direct: { label: 'Direct', color: 'var(--chart-2)' },
  organic: { label: 'Organic', color: 'var(--chart-3)' },
  referral: { label: 'Referral', color: 'var(--chart-4)' },
  paid: { label: 'Paid', color: 'var(--chart-5)' },
}