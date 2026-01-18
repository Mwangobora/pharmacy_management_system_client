import { format } from 'date-fns'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCustomerLoyaltySummary, useCustomerPurchaseHistory } from '@/hooks/queries/useCustomers'
import type { Customer, CustomerLoyaltySummary, Sale } from '@/types/sales'

interface CustomerDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

export function CustomerDetail({ open, onOpenChange, customer }: CustomerDetailProps) {
  if (!customer) return null
  const { data: loyaltySummary } = useCustomerLoyaltySummary(customer.id)
  const { data: purchaseHistory = [] } = useCustomerPurchaseHistory(customer.id)
  const safeHistory = Array.isArray(purchaseHistory) ? purchaseHistory : []
  const summary = loyaltySummary as CustomerLoyaltySummary | undefined

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Customer Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{customer.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{customer.phone}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{customer.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p>{customer.gender}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p>{customer.address || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p>
              {customer.date_of_birth
                ? Math.max(0, new Date().getFullYear() - new Date(customer.date_of_birth).getFullYear())
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loyalty Points</p>
            <p>{customer.loyalty_points}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <p>{summary?.total_purchases ?? customer.total_purchases}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p>${summary?.total_spent ?? customer.total_spent}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Average Purchase</p>
            <p>{summary?.average_purchase ? `$${summary.average_purchase}` : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Purchase</p>
            <p>{summary?.last_purchase_date ? format(new Date(summary.last_purchase_date), 'PPP') : '-'}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Recent Purchases</p>
          {safeHistory.length === 0 ? (
            <p>-</p>
          ) : (
            <div className="mt-2 space-y-2">
              {safeHistory.slice(0, 3).map((sale: Sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span>{sale.invoice_number}</span>
                  <span className="text-muted-foreground">${sale.net_amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created</p>
          <p>{format(new Date(customer.created_at), 'PPP')}</p>
        </div>
      </div>
    </ResponsiveModal>
  )
}
