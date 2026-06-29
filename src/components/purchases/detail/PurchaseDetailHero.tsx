import { CircleDollarSign, Package, Receipt, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Purchase } from '@/types/suppliers'
import type { PurchaseMetricItem } from '@/types/purchase-detail'
import { PurchaseMetricCard } from './PurchaseMetricCard'
import type { PurchaseItem } from '@/types/suppliers'

interface PurchaseDetailHeroProps {
  purchase: Purchase
  items: PurchaseItem[]
  paymentTone: string
  purchaseDateLabel: string
  netAmount: string
  totalAmount: string
  amountPaid: string
  amountDue: string
  discountAmount: string
  taxAmount: string
}

export function PurchaseDetailHero({
  purchase,
  items,
  paymentTone,
  purchaseDateLabel,
  netAmount,
  totalAmount,
  amountPaid,
  amountDue,
  discountAmount,
  taxAmount,
}: PurchaseDetailHeroProps) {
  const metrics: PurchaseMetricItem[] = [
    {
      icon: Receipt,
      label: 'Net Amount',
      value: netAmount,
      hint: `Gross ${totalAmount}`,
    },
    {
      icon: CircleDollarSign,
      label: 'Amount Paid',
      value: amountPaid,
      hint: `Due ${amountDue}`,
    },
    {
      icon: ShieldCheck,
      label: 'Discount Applied',
      value: discountAmount,
      hint: `Tax ${taxAmount}`,
    },
    {
      icon: Package,
      label: 'Received Stock',
      value: `${items.reduce((sum, item) => sum + item.received_quantity, 0)} units`,
      hint: `${items.reduce((sum, item) => sum + item.quantity, 0)} units ordered`,
    },
  ]

  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-orange-50 via-background to-sky-50 dark:from-orange-950/25 dark:via-background dark:to-sky-950/20">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-700 dark:text-orange-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">{purchase.invoice_number}</h3>
              <p className="text-sm text-muted-foreground">
                {purchase.supplier_name} • {purchaseDateLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={cn('border px-3 py-1 text-xs font-medium capitalize', paymentTone)}>
              {purchase.payment_status}
            </Badge>
            <Badge variant="secondary">{items.length} line items</Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <PurchaseMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  )
}
