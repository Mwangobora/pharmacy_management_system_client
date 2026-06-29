import type { Medicine } from '@/types/inventory'

export interface PosCartItem {
  lineId: string
  medicineId: string
  quantity: number
  unitName: string
}

export interface PosCartLine extends PosCartItem {
  medicine: Medicine
  factorToBaseUnit: number
  unitPrice: number
  lineTotal: number
}
