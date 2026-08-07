import { Award, CalendarClock, Edit, MapPin, Phone, ReceiptText, Trash2, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { DetailHero } from '@/components/detail/DetailHero'
import { DetailInfoCard } from '@/components/detail/DetailInfoCard'
import type { DetailMetricItem } from '@/components/detail/types'
import { useCustomerLoyaltySummary, useCustomerPurchaseHistory } from '@/hooks/queries/useCustomers'
import type { Customer, CustomerLoyaltySummary, Sale } from '@/types/sales'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate, parseDateValue } from '@/lib/date'

interface CustomerDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
}

const GENDER_LABELS: Record<Customer['gender'], string> = {
  M: 'Male',
  F: 'Female',
  Other: 'Other',
}

export function CustomerDetail({ open, onOpenChange, customer, onEdit, onDelete }: CustomerDetailProps) {
  const customerId = customer?.id || ''
  const { data: loyaltySummary } = useCustomerLoyaltySummary(customerId)
  const { data: purchaseHistory = [] } = useCustomerPurchaseHistory(customerId)

  if (!customer) return null

  const safeHistory = Array.isArray(purchaseHistory) ? purchaseHistory : []
  const summary = loyaltySummary as CustomerLoyaltySummary | undefined
  const birthDate = parseDateValue(customer.date_of_birth)
  const age = birthDate ? Math.max(0, new Date().getFullYear() - birthDate.getFullYear()) : null
  const lastPurchaseLabel = formatDate(summary?.last_purchase_date, 'No purchases yet')

  const metrics: DetailMetricItem[] = [
    {
      icon: Award,
      label: 'Loyalty Points',
      value: `${customer.loyalty_points}`,
      hint: 'Points earned from purchases',
    },
    {
      icon: ReceiptText,
      label: 'Total Spent',
      value: formatTzsCurrency(summary?.total_spent ?? customer.total_spent),
      hint: `${summary?.total_purchases ?? customer.total_purchases} purchases to date`,
    },
    {
      icon: CalendarClock,
      label: 'Last Purchase',
      value: lastPurchaseLabel,
      hint: summary?.average_purchase ? `Avg. ${formatTzsCurrency(summary.average_purchase)} per visit` : 'No average yet',
    },
  ]

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Customer Details"
      description="Profile, loyalty status, and recent purchase activity."
      dialogContentClassName="sm:max-w-3xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onOpenChange(false)
                onDelete(customer)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit(customer)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6 pb-1">
        <DetailHero
          icon={UserRound}
          title={customer.full_name}
          subtitle={customer.phone}
          metrics={metrics}
          gradientClassName="from-cyan-50 via-background to-blue-50 dark:from-cyan-950/30 dark:via-background dark:to-blue-950/20"
          iconClassName="bg-cyan-600/10 text-cyan-700 dark:text-cyan-300"
          badges={[
            { label: GENDER_LABELS[customer.gender], variant: 'outline' },
            ...(age !== null ? [{ label: `${age} years old`, variant: 'secondary' as const }] : []),
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <DetailInfoCard
            title="Contact Information"
            description="How to reach this customer"
            icon={Phone}
            items={[
              { label: 'Phone', value: customer.phone },
              { label: 'Email', value: customer.email || 'Not provided' },
            ]}
          />

          <DetailInfoCard
            title="Personal Details"
            description="Background information on file"
            icon={MapPin}
            items={[
              { label: 'Date of Birth', value: birthDate ? formatDate(customer.date_of_birth) : 'Not provided' },
              { label: 'Customer Since', value: formatDate(customer.created_at) },
            ]}
          />
        </div>

        <DetailInfoCard
          title="Address"
          description="Home or delivery address"
          icon={MapPin}
          items={[{ label: 'Address', value: customer.address || 'Not provided' }]}
        />

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Recent Purchases</h4>
                <p className="text-sm text-muted-foreground">Last few invoices from this customer</p>
              </div>
            </div>

            {safeHistory.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No purchases recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {safeHistory.slice(0, 3).map((sale: Sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/25 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-foreground">{sale.invoice_number}</span>
                    <span className="text-muted-foreground">{formatTzsCurrency(sale.net_amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveModal>
  )
}
