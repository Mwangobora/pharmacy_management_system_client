import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Sale } from '@/types/sales'
import { formatTzsCurrency } from '@/lib/currency'

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
            <p>{formatTzsCurrency(sale.total_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax</p>
            <p>{formatTzsCurrency(sale.tax_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Discount</p>
            <p>{formatTzsCurrency(sale.discount_amount)}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Net Amount</p>
            <p>{formatTzsCurrency(sale.net_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p>{formatTzsCurrency(sale.total_paid)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due</p>
            <p>{formatTzsCurrency(sale.amount_due)}</p>
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

        <div className="space-y-3">
          <p className="text-sm font-medium">Items</p>
          {(sale.items || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No item lines recorded.</p>
          ) : (
            sale.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.medicine_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.sold_quantity_in_unit ?? item.quantity} {item.sold_unit_name || 'units'} at {formatTzsCurrency(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-medium">{formatTzsCurrency(item.subtotal)}</p>
                </div>
                {(item.batch_allocations || []).length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {item.batch_allocations?.map((allocation) => (
                      <div key={`${item.id}-${allocation.batch_id}`} className="flex items-center justify-between rounded-lg bg-muted/35 px-3 py-2 text-sm">
                        <span>Batch {allocation.batch_number}</span>
                        <span>{allocation.quantity} used{allocation.returned_quantity ? `, ${allocation.returned_quantity} returned` : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}
