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
  batch_number: string | null
  manufacture_date: string | null
  expiry_date: string | null
  purchase_price: string | null
  selling_price: string
  markup_percentage: string | null
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  unit: MedicineUnit
  base_unit: MedicineUnit
  unit_review_required: boolean
  storage_location: string | null
  barcode: string | null
  requires_prescription: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  profit_per_unit: string
  days_to_expiry: number
  unit_conversions: MedicineUnitConversion[]
  batches: MedicineBatch[]
}

export type MedicineUnit = 'pieces' | 'tablets' | 'capsules' | 'bottles' | 'boxes' | 'strips' | 'vials' | 'tubes' | 'sachets'

export interface MedicineUnitConversion {
  id: string
  unit_name: string
  factor_to_base_unit: number
  is_base_unit: boolean
  allow_purchase: boolean
  allow_sale: boolean
  is_active: boolean
  sort_order: number
}

export interface MedicineBatch {
  id: string
  batch_number: string
  manufacture_date: string | null
  expiry_date: string
  purchase_price: string
  selling_price: string | null
  quantity_received: number
  quantity_on_hand: number
  received_at: string
  supplier: string | null
  supplier_name: string | null
  is_active: boolean
  is_legacy: boolean
  notes: string | null
}

export interface MedicineCreatePayload {
  name: string
  generic_name?: string
  category: string
  supplier: string
  base_unit: MedicineUnit
  selling_price: string
  min_stock_level?: number
  max_stock_level?: number
  storage_location?: string
  barcode?: string
  requires_prescription?: boolean
  is_active?: boolean
  unit_conversions?: MedicineUnitConversionPayload[]
}

export interface MedicineUpdatePayload extends Partial<MedicineCreatePayload> {}

export interface MedicineUnitConversionPayload {
  unit_name: string
  factor_to_base_unit: number
  allow_purchase?: boolean
  allow_sale?: boolean
  is_active?: boolean
  sort_order?: number
}

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
  total_value?: string
  total_stock_value?: string
  currency?: string
}
