import type { LucideIcon } from 'lucide-react'

export type DetailTone = 'default' | 'danger'

export interface MedicineStatusState {
  label: string
  tone: string
}

export interface MedicineMetricItem {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  tone?: DetailTone
}

export interface MedicineDetailItem {
  label: string
  value: string
}

