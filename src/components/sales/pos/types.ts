import type { Medicine } from '@/types/inventory'

export interface PosCartItem {
  medicineId: string
  quantity: number
}

export interface PosCartLine extends PosCartItem {
  medicine: Medicine
  lineTotal: number
}
