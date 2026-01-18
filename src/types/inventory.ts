export interface Category {
  id: string
  name: string
  description: string
  code: string
  display_order: number
  is_active: boolean
  created_at: string
  medicine_count: number
}

export interface CategoryCreatePayload {
  name: string
  description?: string
  code?: string
  display_order?: number
  is_active?: boolean
}

export interface CategoryUpdatePayload extends Partial<CategoryCreatePayload> {}

export interface Medicine {
  id: string
  name: string
  generic_name: string
  category: string
  category_name: string
  supplier: string
  supplier_name: string
  batch_number: string
  manufacture_date: string
  expiry_date: string
  purchase_price: string
  selling_price: string
  markup_percentage: string | null
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  unit: MedicineUnit
  storage_location: string | null
  barcode: string | null
  requires_prescription: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  profit_per_unit: string
  days_to_expiry: number
}

export type MedicineUnit = 'pieces' | 'tablets' | 'capsules' | 'bottles' | 'boxes' | 'strips' | 'vials' | 'tubes' | 'sachets'

export interface MedicineCreatePayload {
  name: string
  generic_name: string
  category: string
  supplier: string
  batch_number: string
  manufacture_date: string
  expiry_date: string
  purchase_price: string
  selling_price: string
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  unit: MedicineUnit
  storage_location?: string
  barcode?: string
  requires_prescription?: boolean
  is_active?: boolean
}

export interface MedicineUpdatePayload extends Partial<MedicineCreatePayload> {}

export interface StockAdjustment {
  adjustment_type: 'increase' | 'decrease'
  quantity: number
  reason: string
}

export interface StockTransaction {
  id: string
  medicine: string
  medicine_name: string
  transaction_type: string
  transaction_type_display: string
  quantity: number
  previous_quantity: number
  new_quantity: number
  reference_type: string | null
  reference_id: string | null
  notes: string | null
  created_by: string
  created_by_username: string
  transaction_date: string
}

export interface DashboardStats {
  total_medicines: number
  low_stock_count: number
  expiring_soon_count: number
  expired_count: number
  total_value: string
}
