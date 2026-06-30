import {
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  type LucideIcon,
  Receipt,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDateTime } from '@/lib/date'
import type { Sale } from '@/types/sales'

interface SaleDetailContentProps {
  sale: Sale
}

function MoneyTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-lg font-semibold">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

export function SaleDetailContent({ sale }: SaleDetailContentProps) {
  const soldItemCount = sale.items?.length ?? 0
  const totalUnitsSold = (sale.items ?? []).reduce(
    (sum, item) => sum + Number(item.sold_quantity_in_unit ?? item.quantity ?? 0),
    0,
  )

  return (
    <div className="space-y-6 pb-1">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-50 via-background to-sky-50 dark:from-emerald-950/20 dark:via-background dark:to-sky-950/15">
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                <Receipt className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">{sale.invoice_number}</h3>
                <p className="text-sm text-muted-foreground">
                  {sale.customer_name || 'Walk-in customer'} • {formatDateTime(sale.sale_date)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={sale.payment_status === 'paid' ? 'default' : 'secondary'}>
                {sale.payment_status}
              </Badge>
              <Badge variant="outline">{sale.payment_method}</Badge>
              <Badge variant="secondary">{soldItemCount} items</Badge>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MoneyTile
              icon={Receipt}
              label="Net Amount"
              value={formatTzsCurrency(sale.net_amount)}
              hint={`Gross ${formatTzsCurrency(sale.total_amount)}`}
            />
            <MoneyTile
              icon={CircleDollarSign}
              label="Amount Paid"
              value={formatTzsCurrency(sale.total_paid)}
              hint={`Due ${formatTzsCurrency(sale.amount_due)}`}
            />
            <MoneyTile
              icon={ShieldCheck}
              label="Profit Snapshot"
              value={formatTzsCurrency(sale.total_profit)}
              hint={`Tax ${formatTzsCurrency(sale.tax_amount)}`}
            />
            <MoneyTile
              icon={ClipboardList}
              label="Units Sold"
              value={`${totalUnitsSold}`}
              hint={`${soldItemCount} line items`}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Sale Overview</h4>
                <p className="text-sm text-muted-foreground">Customer, cashier, and timing details</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Customer" value={sale.customer_name || 'Walk-in customer'} />
              <InfoTile label="Served By" value={sale.served_by_username || 'Unknown'} />
              <InfoTile label="Sale Date" value={formatDateTime(sale.sale_date)} />
              <InfoTile label="Updated On" value={formatDateTime(sale.updated_at)} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Financial Breakdown</h4>
                <p className="text-sm text-muted-foreground">Recorded amounts from the completed sale</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoTile label="Total Amount" value={formatTzsCurrency(sale.total_amount)} />
              <InfoTile label="Net Amount" value={formatTzsCurrency(sale.net_amount)} />
              <InfoTile label="Tax" value={formatTzsCurrency(sale.tax_amount)} />
              <InfoTile label="Discount" value={formatTzsCurrency(sale.discount_amount)} />
              <InfoTile label="Paid" value={formatTzsCurrency(sale.total_paid)} />
              <InfoTile label="Balance Due" value={formatTzsCurrency(sale.amount_due)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/70 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">Sold Items</h4>
              <p className="text-sm text-muted-foreground">Item lines, unit pricing, and batch allocation</p>
            </div>
          </div>

          {(sale.items || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
              No item lines were returned for this sale.
            </div>
          ) : (
            <div className="grid gap-3">
              {sale.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{item.medicine_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[item.medicine_display_id, item.sold_unit_name || 'base unit', item.batch_number].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatTzsCurrency(item.subtotal)}</p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <InfoTile label="Quantity" value={`${item.sold_quantity_in_unit ?? item.quantity} ${item.sold_unit_name || 'units'}`} />
                    <InfoTile label="Unit Price" value={formatTzsCurrency(item.unit_price)} />
                    <InfoTile label="Subtotal" value={formatTzsCurrency(item.subtotal)} />
                    <InfoTile label="Cost Snapshot" value={item.cost_price_snapshot ? formatTzsCurrency(item.cost_price_snapshot) : 'Not recorded'} />
                    <InfoTile label="Profit" value={formatTzsCurrency(item.profit ?? 0)} />
                  </div>

                  {(item.batch_allocations || []).length > 0 ? (
                    <div className="mt-4 grid gap-2">
                      {item.batch_allocations?.map((allocation) => (
                        <div
                          key={`${item.id}-${allocation.batch_id}`}
                          className="flex flex-col gap-1 rounded-xl border border-border/60 bg-background px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-medium">Batch {allocation.batch_number}</span>
                          <span className="text-muted-foreground">
                            Used {allocation.quantity}
                            {allocation.returned_quantity
                              ? ` • Returned ${allocation.returned_quantity}`
                              : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <h4 className="font-semibold">Payments Recorded</h4>
            {(sale.payments || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                No payment transactions were recorded for this sale.
              </div>
            ) : (
              <div className="grid gap-3">
                {sale.payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{payment.payment_method_display}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(payment.payment_date)} • {payment.received_by_username}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{formatTzsCurrency(payment.amount)}</p>
                    </div>
                    {payment.transaction_ref ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Ref: {payment.transaction_ref}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <h4 className="font-semibold">Notes</h4>
            <div className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm text-muted-foreground">
              {sale.notes || 'No notes were added for this sale.'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
