export interface Supplier {
  id: string
  name: string
  contact_person: string | null
  phone: string
  email: string | null
  address: string | null
  tax_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  total_purchases: string
  active_medicines_count: number
}

export interface SupplierCreatePayload {
  name: string
  contact_person?: string
  phone: string
  email?: string
  address?: string
  tax_id?: string
  is_active?: boolean
}

export interface SupplierUpdatePayload extends Partial<SupplierCreatePayload> {}

export interface PurchaseItem {
  id: string
  medicine: string
  medicine_name: string
  medicine_display_id: string
  quantity: number
  unit_price: string
  discount_percent: string
  tax_percent: string
  subtotal: string
  received_quantity: number
}

export interface Purchase {
  id: string
  supplier: string
  supplier_name: string
  invoice_number: string
  purchase_date: string
  total_amount: string
  tax_amount: string
  discount_amount: string
  net_amount: string
  payment_status: 'pending' | 'partial' | 'paid'
  notes: string | null
  created_by: string
  created_by_username: string
  created_at: string
  updated_at: string
  items: PurchaseItem[]
  amount_paid: string
  amount_due: string
}

export interface PurchaseItemPayload {
  medicine: string
  quantity: number
  unit_price: string
  discount_percent?: string
  tax_percent?: string
}

export interface PurchaseCreatePayload {
  supplier: string
  invoice_number: string
  purchase_date: string
  tax_amount?: string
  discount_amount?: string
  notes?: string
  items: PurchaseItemPayload[]
}

export interface PurchaseUpdatePayload {
  invoice_number?: string
  purchase_date?: string
  tax_amount?: string
  discount_amount?: string
  notes?: string
}

export interface ReceiveItemsPayload {
  items: { item_id: string; received_quantity: number }[]
}

export interface UpdatePaymentStatusPayload {
  payment_status: 'pending' | 'partial' | 'paid'
}
