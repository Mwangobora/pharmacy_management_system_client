'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { PaymentMethod } from '@/types/sales'
import { paymentMethods } from './paymentMethods'

interface PaymentSectionProps {
  amountPaid: string
  notes: string
  paymentMethod: PaymentMethod
  onAmountPaidChange: (value: string) => void
  onNotesChange: (value: string) => void
  onPaymentMethodChange: (value: PaymentMethod) => void
}

export function PaymentSection({
  amountPaid,
  notes,
  paymentMethod,
  onAmountPaidChange,
  onNotesChange,
  onPaymentMethodChange,
}: PaymentSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 p-4">
      <h3 className="text-sm font-semibold">Payment</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Method</p>
          <Select value={paymentMethod} onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Amount paid</p>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={amountPaid}
            onChange={(event) => onAmountPaidChange(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Notes</p>
        <Textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Optional sale note"
          className="min-h-20"
        />
      </div>
    </div>
  )
}
