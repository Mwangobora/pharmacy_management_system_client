import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES, getSaleDetailPath } from '@/routes/paths'
import type { DashboardRecentSale } from '@/types/dashboard'
import { formatTzsCurrency } from '@/lib/currency'
import { DashboardEmptyState } from '../DashboardEmptyState'

interface RecentSalesTableProps {
  rows: DashboardRecentSale[]
}

export function RecentSalesTable({ rows }: RecentSalesTableProps) {
  if (rows.length === 0) {
    return (
      <DashboardEmptyState
        title="No recent sales"
        description="Completed sales will appear here as soon as transactions are recorded."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">
                <Link to={getSaleDetailPath(row.id)} className="text-primary hover:underline">
                  {row.invoice_number}
                </Link>
              </TableCell>
              <TableCell>{new Intl.DateTimeFormat('en-TZ', { hour: '2-digit', minute: '2-digit' }).format(new Date(row.sale_date))}</TableCell>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.cashier}</TableCell>
              <TableCell>{row.items_count}</TableCell>
              <TableCell className="capitalize">{row.payment_method}</TableCell>
              <TableCell className="capitalize">{row.status}</TableCell>
              <TableCell className="text-right">{formatTzsCurrency(row.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pt-3 text-right">
        <Link to={ROUTES.SALES} className="text-sm font-medium text-primary hover:underline">
          View all sales
        </Link>
      </div>
    </div>
  )
}
