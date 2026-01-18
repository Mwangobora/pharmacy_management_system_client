import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Sale } from '@/types/sales'

interface SaleDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
}

export function SaleDetail({ open, onOpenChange, sale }: SaleDetailProps) {
  if (!sale) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Sale Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Invoice</p>
            <p className="font-medium">{sale.invoice_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={sale.payment_status === 'paid' ? 'default' : 'secondary'}>
              {sale.payment_status}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p>{sale.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sale Date</p>
            <p>{format(new Date(sale.sale_date), 'PPP p')}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p>${sale.total_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax</p>
            <p>${sale.tax_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Discount</p>
            <p>${sale.discount_amount}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Net Amount</p>
            <p>${sale.net_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p>${sale.total_paid}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due</p>
            <p>${sale.amount_due}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p>{sale.payment_method}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Served By</p>
            <p>{sale.served_by_username}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          <p>{sale.notes || '-'}</p>
        </div>
      </div>
    </ResponsiveModal>
  )
}
