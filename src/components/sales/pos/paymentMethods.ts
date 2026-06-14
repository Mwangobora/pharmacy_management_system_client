import type { PaymentMethod } from '@/types/sales'

export const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile Money' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'credit', label: 'Credit' },
]
