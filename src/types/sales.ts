export interface Customer {
  id: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  email: string | null
  address: string | null
  date_of_birth: string | null
  gender: 'M' | 'F' | 'Other'
  loyalty_points: number
  created_at: string
  updated_at: string
  total_purchases: number
  total_spent: string
}

export interface CustomerCreatePayload {
  first_name: string
  last_name: string
  phone: string
  email?: string
  address?: string
  date_of_birth?: string
  gender: 'M' | 'F' | 'Other'
}

export interface CustomerUpdatePayload extends Partial<CustomerCreatePayload> {}

export interface SaleItem {
  id: string
  medicine: string
  medicine_name: string
  quantity: number
  unit_price: string
  batch_number: string
  subtotal: string
}

export interface Payment {
  id: string
  payment_id: string
  sale: string
  amount: string
  payment_method: PaymentMethod
  payment_method_display: string
  payment_date: string
  transaction_ref: string | null
  received_by: string
  received_by_username: string
  notes: string | null
  created_at: string
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'insurance' | 'credit'
export type PaymentStatus = 'paid' | 'partial' | 'pending'

export interface Sale {
  id: string
  customer: string | null
  customer_name: string
  invoice_number: string
  sale_date: string
  total_amount: string
  tax_amount: string
  discount_amount: string
  net_amount: string
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  served_by: string
  served_by_username: string
  notes: string | null
  created_at: string
  updated_at: string
  items: SaleItem[]
  payments: Payment[]
  total_paid: string
  amount_due: string
  total_profit: string
}

export interface SaleItemPayload {
  medicine: string
  quantity: number
  unit_price: string
  batch_number: string
}

export interface SaleCreatePayload {
  customer?: string
  sale_date?: string
  tax_amount?: string
  discount_amount?: string
  payment_method: PaymentMethod
  notes?: string
  items: SaleItemPayload[]
  payment_amount?: string
  transaction_ref?: string
}

export interface ProcessPaymentPayload {
  amount: string
  payment_method: PaymentMethod
  transaction_ref?: string
  notes?: string
}

export interface RefundPayload {
  refund_amount: string
  reason: string
  items_to_refund?: { sale_item_id: string; quantity: number }[]
}

export interface AddLoyaltyPointsPayload {
  points: number
}

export interface DailySummary {
  date: string
  total_sales: number
  total_revenue: string
  total_profit: string
}

export interface TopSellingMedicine {
  medicine_id: string
  medicine_name: string
  total_quantity: number
  total_revenue: string
}
