import type { Medicine } from '@/types/inventory'

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
  return medicine.days_to_expiry < 0
}

export function isMedicineExpiringSoon(medicine: Medicine) {
  return medicine.days_to_expiry >= 0 && medicine.days_to_expiry <= 30
}

export function buildPrescriptionNotes(baseNotes: string, prescriptionItems: Medicine[]) {
  const notes = baseNotes.trim()
  if (prescriptionItems.length === 0) return notes || undefined

  const prescriptionNote = `Prescription-only items: ${prescriptionItems.map((item) => item.name).join(', ')}`
  return notes ? `${notes}\n${prescriptionNote}` : prescriptionNote
}
