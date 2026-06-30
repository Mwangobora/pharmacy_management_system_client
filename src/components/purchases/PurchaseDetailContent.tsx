import {
  ClipboardCheck,
  FileSpreadsheet,
  Truck,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { PurchaseCompactStat } from '@/components/purchases/detail/PurchaseCompactStat'
import { PurchaseDetailHero } from '@/components/purchases/detail/PurchaseDetailHero'
import { PurchaseInfoTile } from '@/components/purchases/detail/PurchaseInfoTile'
import { PurchaseMoneyRow } from '@/components/purchases/detail/PurchaseMoneyRow'
import { PurchaseSectionTitle } from '@/components/purchases/detail/PurchaseSectionTitle'
import type { Purchase } from '@/types/suppliers'

interface PurchaseDetailContentProps {
  purchase: Purchase
  onPaymentStatusUpdate?: (paymentStatus: Purchase['payment_status']) => void
  isUpdatingPayment?: boolean
}

export function PurchaseDetailContent({
  purchase,
  onPaymentStatusUpdate,
  isUpdatingPayment = false,
}: PurchaseDetailContentProps) {
  const purchaseItems = purchase.items ?? []
  const paymentTone =
    purchase.payment_status === 'paid'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
      : purchase.payment_status === 'partial'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'

  const purchaseDateLabel = formatDate(purchase.purchase_date)
  const createdAtLabel = formatDate(purchase.created_at)
  const updatedAtLabel = formatDate(purchase.updated_at)
  const netAmountValue = purchase.net_amount ?? '0'
  const totalAmountValue = purchase.total_amount ?? purchase.net_amount ?? '0'
  const amountPaidValue = purchase.amount_paid ?? (purchase.payment_status === 'paid' ? purchase.net_amount : '0')
  const amountDueValue = purchase.amount_due ?? (purchase.payment_status === 'paid' ? '0' : purchase.net_amount ?? '0')
  const discountAmountValue = purchase.discount_amount ?? '0'
  const taxAmountValue = purchase.tax_amount ?? '0'

  return (
    <div className="space-y-6 pb-1">
      <PurchaseDetailHero
        purchase={purchase}
        items={purchaseItems}
        paymentTone={paymentTone}
        purchaseDateLabel={purchaseDateLabel}
        netAmount={formatTzsCurrency(netAmountValue)}
        totalAmount={formatTzsCurrency(totalAmountValue)}
        amountPaid={formatTzsCurrency(amountPaidValue)}
        amountDue={formatTzsCurrency(amountDueValue)}
        discountAmount={formatTzsCurrency(discountAmountValue)}
        taxAmount={formatTzsCurrency(taxAmountValue)}
      />

      {onPaymentStatusUpdate ? (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <PurchaseSectionTitle
              icon={FileSpreadsheet}
              title="Payment Verification"
              subtitle="Update the supplier payment state for this purchase."
            />
            <div className="flex flex-wrap gap-3">
              {(['pending', 'partial', 'paid'] as const).map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={purchase.payment_status === status ? 'default' : 'outline'}
                  disabled={isUpdatingPayment || purchase.payment_status === status}
                  onClick={() => onPaymentStatusUpdate(status)}
                >
                  Mark {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Current status: <span className="font-medium capitalize text-foreground">{purchase.payment_status}</span>
            </p>
          </CardContent>
        </Card>
      ) : null}

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
              <PurchaseInfoTile label="Created By" value={purchase.created_by_username ?? 'Unknown'} />
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
              <PurchaseMoneyRow label="Gross Total" value={totalAmountValue} />
              <PurchaseMoneyRow label="Net Amount" value={netAmountValue} strong />
              <PurchaseMoneyRow label="Discount" value={discountAmountValue} />
              <PurchaseMoneyRow label="Tax" value={taxAmountValue} />
              <PurchaseMoneyRow label="Amount Paid" value={amountPaidValue} />
              <PurchaseMoneyRow label="Balance Due" value={amountDueValue} strong />
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
            {purchaseItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-border/70 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))]"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.medicine_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.medicine_display_id, item.batch_number, item.unit_name].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <PurchaseCompactStat label="Ordered" value={`${item.quantity_in_unit ?? item.quantity} ${item.unit_name || ''}`.trim()} />
                <PurchaseCompactStat label="Base Units" value={`${item.quantity_base_units ?? item.quantity}`} />
                <PurchaseCompactStat label="Received" value={`${item.received_quantity}`} />
                <PurchaseCompactStat label="Unit Price" value={formatTzsCurrency(item.unit_price)} />
                <PurchaseCompactStat label="Subtotal" value={formatTzsCurrency(item.subtotal)} />
              </div>
            ))}

            {purchaseItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
                No purchased item lines were returned for this record.
              </div>
            ) : null}

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
  )
}
