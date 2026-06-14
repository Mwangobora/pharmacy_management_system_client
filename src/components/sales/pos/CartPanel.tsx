'use client'

import { Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Customer, PaymentMethod } from '@/types/sales'
import type { Medicine } from '@/types/inventory'
import type { PosCartLine } from './types'
import { CartItemsList } from './CartItemsList'
import { CustomerSection } from './CustomerSection'
import { PaymentSection } from './PaymentSection'
import { TotalsSection } from './TotalsSection'

interface CartPanelProps {
  amountDue: number
  amountPaid: string
  cartItems: PosCartLine[]
  changeDue: number
  customerId: string
  customers: Customer[]
  customersLoading: boolean
  isSubmitting: boolean
  notes: string
  numericAmountPaid: number
  paymentMethod: PaymentMethod
  selectedCustomer: Customer | null
  subtotal: number
  onAmountPaidChange: (value: string) => void
  onClear: () => void
  onCustomerChange: (value: string) => void
  onNotesChange: (value: string) => void
  onPaymentMethodChange: (value: PaymentMethod) => void
  onRemoveItem: (medicineId: string) => void
  onSubmit: () => void
  onUpdateQuantity: (medicine: Medicine, quantity: number) => void
}

export function CartPanel(props: CartPanelProps) {
  const isPristine = props.cartItems.length === 0 && !props.notes && props.customerId === 'walk-in' && !props.amountPaid

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4" />
              Current Sale
            </CardTitle>
            <CardDescription>{props.cartItems.length} item(s) in cart</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={props.onClear} disabled={isPristine}>
            Clear Cart
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <CartItemsList items={props.cartItems} onRemove={props.onRemoveItem} onUpdateQuantity={props.onUpdateQuantity} />
        <CustomerSection
          customers={props.customers}
          customerId={props.customerId}
          selectedCustomer={props.selectedCustomer}
          customersLoading={props.customersLoading}
          onChange={props.onCustomerChange}
        />
        <PaymentSection
          amountPaid={props.amountPaid}
          notes={props.notes}
          paymentMethod={props.paymentMethod}
          onAmountPaidChange={props.onAmountPaidChange}
          onNotesChange={props.onNotesChange}
          onPaymentMethodChange={props.onPaymentMethodChange}
        />
        <TotalsSection
          subtotal={props.subtotal}
          amountPaid={props.numericAmountPaid}
          amountDue={props.amountDue}
          changeDue={props.changeDue}
        />

        <Button type="button" className="h-11 w-full" disabled={props.cartItems.length === 0 || props.isSubmitting} onClick={props.onSubmit}>
          {props.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  )
}
