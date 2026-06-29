import {
  ClipboardCheck,
  FileSpreadsheet,
  Truck,
  UserRound,
} from 'lucide-react'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Card, CardContent } from '@/components/ui/card'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { PurchaseCompactStat } from '@/components/purchases/detail/PurchaseCompactStat'
import { PurchaseDetailHero } from '@/components/purchases/detail/PurchaseDetailHero'
import { PurchaseInfoTile } from '@/components/purchases/detail/PurchaseInfoTile'
import { PurchaseMoneyRow } from '@/components/purchases/detail/PurchaseMoneyRow'
import { PurchaseSectionTitle } from '@/components/purchases/detail/PurchaseSectionTitle'
import type { Purchase } from '@/types/suppliers'

interface PurchaseDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseDetail({ open, onOpenChange, purchase }: PurchaseDetailProps) {
  if (!purchase) return null

  const paymentTone =
    purchase.payment_status === 'paid'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
      : purchase.payment_status === 'partial'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'

  const purchaseDateLabel = formatDate(purchase.purchase_date)
  const createdAtLabel = formatDate(purchase.created_at)
  const updatedAtLabel = formatDate(purchase.updated_at)
  const netAmount = formatTzsCurrency(purchase.net_amount)
  const totalAmount = formatTzsCurrency(purchase.total_amount)
  const amountPaid = formatTzsCurrency(purchase.amount_paid)
  const amountDue = formatTzsCurrency(purchase.amount_due)
  const discountAmount = formatTzsCurrency(purchase.discount_amount)
  const taxAmount = formatTzsCurrency(purchase.tax_amount)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Purchase Details"
      description="See supplier, financial, and received-item information with a cleaner summary."
      dialogContentClassName="sm:max-w-5xl"
    >
      <div className="space-y-6 pb-1">
        <PurchaseDetailHero
          purchase={purchase}
          paymentTone={paymentTone}
          purchaseDateLabel={purchaseDateLabel}
          netAmount={netAmount}
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          amountDue={amountDue}
          discountAmount={discountAmount}
          taxAmount={taxAmount}
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <PurchaseSectionTitle
                icon={Truck}
                title="Order Overview"
                subtitle="Supplier and order ownership details"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <PurchaseInfoTile label="Supplier" value={purchase.supplier_name} />
                <PurchaseInfoTile label="Invoice Number" value={purchase.invoice_number} />
                <PurchaseInfoTile label="Purchase Date" value={purchaseDateLabel} />
                <PurchaseInfoTile label="Created By" value={purchase.created_by_username} />
                <PurchaseInfoTile label="Recorded On" value={createdAtLabel} />
                <PurchaseInfoTile label="Updated On" value={updatedAtLabel} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <PurchaseSectionTitle
                icon={FileSpreadsheet}
                title="Financial Breakdown"
                subtitle="Amounts contributing to this purchase order"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <PurchaseMoneyRow label="Gross Total" value={purchase.total_amount} />
                <PurchaseMoneyRow label="Net Amount" value={purchase.net_amount} strong />
                <PurchaseMoneyRow label="Discount" value={purchase.discount_amount} />
                <PurchaseMoneyRow label="Tax" value={purchase.tax_amount} />
                <PurchaseMoneyRow label="Amount Paid" value={purchase.amount_paid} />
                <PurchaseMoneyRow label="Balance Due" value={purchase.amount_due} strong />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <PurchaseSectionTitle
              icon={ClipboardCheck}
              title="Purchased Items"
              subtitle="Ordered medicines and received quantities"
            />

            <div className="grid gap-3">
              {purchase.items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border border-border/70 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,0.75fr))]"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{item.medicine_name}</p>
                    <p className="text-xs text-muted-foreground">{item.medicine_display_id}</p>
                  </div>
                  <PurchaseCompactStat label="Ordered" value={`${item.quantity}`} />
                  <PurchaseCompactStat label="Received" value={`${item.received_quantity}`} />
                  <PurchaseCompactStat label="Unit Price" value={formatTzsCurrency(item.unit_price)} />
                  <PurchaseCompactStat label="Subtotal" value={formatTzsCurrency(item.subtotal)} />
                </div>
              ))}

              {purchase.notes ? (
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="mt-1 text-sm text-muted-foreground">{purchase.notes}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveModal>
  )
}
