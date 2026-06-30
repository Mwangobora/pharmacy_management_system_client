import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCustomerLoyaltySummary, useCustomerPurchaseHistory } from '@/hooks/queries/useCustomers'
import type { Customer, CustomerLoyaltySummary, Sale } from '@/types/sales'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate, parseDateValue } from '@/lib/date'

interface CustomerDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

export function CustomerDetail({ open, onOpenChange, customer }: CustomerDetailProps) {
  const customerId = customer?.id || ''
  const { data: loyaltySummary } = useCustomerLoyaltySummary(customerId)
  const { data: purchaseHistory = [] } = useCustomerPurchaseHistory(customerId)

  if (!customer) return null

  const safeHistory = Array.isArray(purchaseHistory) ? purchaseHistory : []
  const summary = loyaltySummary as CustomerLoyaltySummary | undefined
  const birthDate = parseDateValue(customer.date_of_birth)
  const createdAtLabel = formatDate(customer.created_at)
  const lastPurchaseLabel = formatDate(summary?.last_purchase_date, '-')

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
              {birthDate
                ? Math.max(0, new Date().getFullYear() - birthDate.getFullYear())
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
            <p>{formatTzsCurrency(summary?.total_spent ?? customer.total_spent)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Average Purchase</p>
            <p>{summary?.average_purchase ? formatTzsCurrency(summary.average_purchase) : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Purchase</p>
            <p>{lastPurchaseLabel}</p>
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
                  <span className="text-muted-foreground">{formatTzsCurrency(sale.net_amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created</p>
          <p>{createdAtLabel}</p>
        </div>
      </div>
    </ResponsiveModal>
  )
}
