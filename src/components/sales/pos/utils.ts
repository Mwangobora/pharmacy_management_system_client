import type { Medicine, MedicineUnitConversion } from '@/types/inventory'

export const POS_RESULT_LIMIT = 12

export function formatPosDate(date: Date) {
  return new Intl.DateTimeFormat('en-TZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function matchesMedicineQuery(medicine: Medicine, query: string) {
  if (!query) return true

  const haystack = [
    medicine.name,
    medicine.generic_name,
    medicine.category_name,
    medicine.barcode,
    medicine.batch_number,
    medicine.unit,
    medicine.supplier_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((token) => haystack.includes(token))
}

export function getStockTone(medicine: Medicine) {
  if (medicine.stock_quantity <= 0) return 'out'
  if (medicine.stock_quantity <= medicine.min_stock_level) return 'low'
  return 'in'
}

export function isMedicineExpired(medicine: Medicine) {
  return medicine.days_to_expiry !== null && medicine.days_to_expiry < 0
}

export function isMedicineExpiringSoon(medicine: Medicine) {
  return medicine.days_to_expiry !== null && medicine.days_to_expiry >= 0 && medicine.days_to_expiry <= 30
}

export function buildPrescriptionNotes(baseNotes: string, prescriptionItems: Medicine[]) {
  const notes = baseNotes.trim()
  if (prescriptionItems.length === 0) return notes || undefined

  const prescriptionNote = `Prescription-only items: ${prescriptionItems.map((item) => item.name).join(', ')}`
  return notes ? `${notes}\n${prescriptionNote}` : prescriptionNote
}

export function getUnitConversion(medicine: Medicine, unitName?: string | null): MedicineUnitConversion {
  const normalizedUnit = unitName || medicine.base_unit || medicine.unit
  const configured = medicine.unit_conversions?.find((item) => item.unit_name === normalizedUnit && item.is_active)
  if (configured) return configured

  return {
    id: `${medicine.id}-${normalizedUnit}`,
    unit_name: normalizedUnit,
    factor_to_base_unit: 1,
    is_base_unit: true,
    allow_purchase: true,
    allow_sale: true,
    is_active: true,
    sort_order: 0,
  }
}

export function getSaleUnits(medicine: Medicine) {
  const configured = (medicine.unit_conversions || [])
    .filter((item) => item.is_active && item.allow_sale)
    .sort((left, right) => left.sort_order - right.sort_order || left.unit_name.localeCompare(right.unit_name))

  return configured.length > 0 ? configured : [getUnitConversion(medicine, medicine.base_unit || medicine.unit)]
}

export function getPurchaseUnits(medicine: Medicine) {
  const configured = (medicine.unit_conversions || [])
    .filter((item) => item.is_active && item.allow_purchase)
    .sort((left, right) => left.sort_order - right.sort_order || left.unit_name.localeCompare(right.unit_name))

  return configured.length > 0 ? configured : [getUnitConversion(medicine, medicine.base_unit || medicine.unit)]
}

export function getUnitPriceFromBase(basePrice: string | number, factorToBaseUnit: number) {
  return Number(basePrice || 0) * Math.max(factorToBaseUnit, 1)
}

export function getMaxSellableUnits(medicine: Medicine, unitName?: string | null) {
  const conversion = getUnitConversion(medicine, unitName)
  return Math.max(Math.floor(Number(medicine.stock_quantity || 0) / Math.max(conversion.factor_to_base_unit, 1)), 0)
}
