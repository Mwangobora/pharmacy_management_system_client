import {
  ClipboardCheck,
  FileSpreadsheet,
  Truck,
  UserRound,
} from 'lucide-react'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { PurchaseCompactStat } from '@/components/purchases/detail/PurchaseCompactStat'
import { PurchaseDetailHero } from '@/components/purchases/detail/PurchaseDetailHero'
import { PurchaseInfoTile } from '@/components/purchases/detail/PurchaseInfoTile'
import { PurchaseMoneyRow } from '@/components/purchases/detail/PurchaseMoneyRow'
import { PurchaseSectionTitle } from '@/components/purchases/detail/PurchaseSectionTitle'
import { useUpdatePurchasePaymentStatus } from '@/hooks/mutations/usePurchases'
import { usePurchase } from '@/hooks/queries/usePurchases'
import { notify } from '@/lib/notify'
import type { Purchase } from '@/types/suppliers'

interface PurchaseDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseDetail({ open, onOpenChange, purchase }: PurchaseDetailProps) {
  const purchaseId = open && purchase ? purchase.id : ''
  const { data: purchaseDetails } = usePurchase(purchaseId)
  const updatePaymentStatus = useUpdatePurchasePaymentStatus()
  if (!purchase) return null

  const resolvedPurchase = purchaseDetails ?? purchase
  const purchaseItems = resolvedPurchase.items ?? []

  const paymentTone =
    resolvedPurchase.payment_status === 'paid'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
      : resolvedPurchase.payment_status === 'partial'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'

  const purchaseDateLabel = formatDate(resolvedPurchase.purchase_date)
  const createdAtLabel = formatDate(resolvedPurchase.created_at)
  const updatedAtLabel = formatDate(resolvedPurchase.updated_at)
  const netAmountValue = resolvedPurchase.net_amount ?? '0'
  const totalAmountValue = resolvedPurchase.total_amount ?? resolvedPurchase.net_amount ?? '0'
  const amountPaidValue = resolvedPurchase.amount_paid ?? (resolvedPurchase.payment_status === 'paid' ? resolvedPurchase.net_amount : '0')
  const amountDueValue = resolvedPurchase.amount_due ?? (resolvedPurchase.payment_status === 'paid' ? '0' : resolvedPurchase.net_amount ?? '0')
  const discountAmountValue = resolvedPurchase.discount_amount ?? '0'
  const taxAmountValue = resolvedPurchase.tax_amount ?? '0'
  const netAmount = formatTzsCurrency(netAmountValue)
  const totalAmount = formatTzsCurrency(totalAmountValue)
  const amountPaid = formatTzsCurrency(amountPaidValue)
  const amountDue = formatTzsCurrency(amountDueValue)
  const discountAmount = formatTzsCurrency(discountAmountValue)
  const taxAmount = formatTzsCurrency(taxAmountValue)

  const handlePaymentStatusUpdate = async (payment_status: Purchase['payment_status']) => {
    try {
      await updatePaymentStatus.mutateAsync({
        id: resolvedPurchase.id,
        payload: { payment_status },
      })
      notify.success(`Purchase marked as ${payment_status}`, {
        description: 'The supplier payment status has been updated.',
      })
    } catch (error) {
      notify.apiError(error, 'Purchase payment status could not be updated', {
        fallback: 'The supplier payment verification could not be saved.',
        persistent: true,
      })
    }
  }

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
          purchase={resolvedPurchase}
          items={purchaseItems}
          paymentTone={paymentTone}
          purchaseDateLabel={purchaseDateLabel}
          netAmount={netAmount}
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          amountDue={amountDue}
          discountAmount={discountAmount}
          taxAmount={taxAmount}
        />

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <PurchaseSectionTitle
              icon={FileSpreadsheet}
              title="Payment Verification"
              subtitle="Update the supplier payment state for this purchase."
            />
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={resolvedPurchase.payment_status === 'pending' ? 'default' : 'outline'}
                disabled={updatePaymentStatus.isPending || resolvedPurchase.payment_status === 'pending'}
                onClick={() => handlePaymentStatusUpdate('pending')}
              >
                Mark Pending
              </Button>
              <Button
                type="button"
                variant={resolvedPurchase.payment_status === 'partial' ? 'default' : 'outline'}
                disabled={updatePaymentStatus.isPending || resolvedPurchase.payment_status === 'partial'}
                onClick={() => handlePaymentStatusUpdate('partial')}
              >
                Mark Partial
              </Button>
              <Button
                type="button"
                variant={resolvedPurchase.payment_status === 'paid' ? 'default' : 'outline'}
                disabled={updatePaymentStatus.isPending || resolvedPurchase.payment_status === 'paid'}
                onClick={() => handlePaymentStatusUpdate('paid')}
              >
                Mark Paid
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Current status: <span className="font-medium capitalize text-foreground">{resolvedPurchase.payment_status}</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <PurchaseSectionTitle
                icon={Truck}
                title="Order Overview"
                subtitle="Supplier and order ownership details"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <PurchaseInfoTile label="Supplier" value={resolvedPurchase.supplier_name} />
                <PurchaseInfoTile label="Invoice Number" value={resolvedPurchase.invoice_number} />
                <PurchaseInfoTile label="Purchase Date" value={purchaseDateLabel} />
                <PurchaseInfoTile label="Created By" value={resolvedPurchase.created_by_username ?? 'Unknown'} />
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
                  Item details will appear here once the full purchase record is loaded.
                </div>
              ) : null}

              {resolvedPurchase.notes ? (
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="mt-1 text-sm text-muted-foreground">{resolvedPurchase.notes}</p>
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
