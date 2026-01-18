import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Purchase } from '@/types/suppliers'

interface PurchaseDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseDetail({ open, onOpenChange, purchase }: PurchaseDetailProps) {
  if (!purchase) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Purchase Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Invoice</p>
            <p className="font-medium">{purchase.invoice_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={purchase.payment_status === 'paid' ? 'default' : 'secondary'}>
              {purchase.payment_status}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Supplier</p>
            <p>{purchase.supplier_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purchase Date</p>
            <p>{format(new Date(purchase.purchase_date), 'PPP')}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p>${purchase.total_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax</p>
            <p>${purchase.tax_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Discount</p>
            <p>${purchase.discount_amount}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Net Amount</p>
            <p>${purchase.net_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p>${purchase.amount_paid}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due</p>
            <p>${purchase.amount_due}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Created By</p>
            <p>{purchase.created_by_username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(purchase.created_at), 'PPP')}</p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
