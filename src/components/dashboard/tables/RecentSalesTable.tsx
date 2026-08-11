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
      <Table className="text-base">
        <TableHeader>
          <TableRow>
            <TableHead className="text-base">Sale</TableHead>
            <TableHead className="text-base">Time</TableHead>
            <TableHead className="text-base">Customer</TableHead>
            <TableHead className="text-base">Cashier</TableHead>
            <TableHead className="text-base">Items</TableHead>
            <TableHead className="text-base">Payment</TableHead>
            <TableHead className="text-base">Status</TableHead>
            <TableHead className="text-right text-base">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-[15px] font-medium md:text-base">
                <Link to={getSaleDetailPath(row.id)} className="text-primary hover:underline">
                  {row.invoice_number}
                </Link>
              </TableCell>
              <TableCell className="text-[15px] md:text-base">{new Intl.DateTimeFormat('en-TZ', { hour: '2-digit', minute: '2-digit' }).format(new Date(row.sale_date))}</TableCell>
              <TableCell className="text-[15px] md:text-base">{row.customer_name}</TableCell>
              <TableCell className="text-[15px] md:text-base">{row.cashier}</TableCell>
              <TableCell className="text-[15px] md:text-base">{row.items_count}</TableCell>
              <TableCell className="text-[15px] capitalize md:text-base">{row.payment_method}</TableCell>
              <TableCell className="text-[15px] capitalize md:text-base">{row.status}</TableCell>
              <TableCell className="text-right text-[15px] font-medium md:text-base">{formatTzsCurrency(row.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pt-3 text-right">
        <Link to={ROUTES.SALES} className="text-base font-medium text-primary hover:underline">
          View all sales
        </Link>
      </div>
    </div>
  )
}
