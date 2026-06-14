'use client'

import { formatTzsCurrency } from '@/lib/currency'

interface TotalsSectionProps {
  subtotal: number
  amountPaid: number
  amountDue: number
  changeDue: number
}

export function TotalsSection({ subtotal, amountPaid, amountDue, changeDue }: TotalsSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatTzsCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Discount</span>
        <span>{formatTzsCurrency(0)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Tax / VAT</span>
        <span>{formatTzsCurrency(0)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Amount paid</span>
        <span>{formatTzsCurrency(amountPaid)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-sm font-medium text-muted-foreground">Grand total</span>
        <span className="text-xl font-semibold">{formatTzsCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Balance</span>
        <span>{formatTzsCurrency(amountDue)}</span>
      </div>
      {changeDue > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Change</span>
          <span>{formatTzsCurrency(changeDue)}</span>
        </div>
      )}
    </div>
  )
}
