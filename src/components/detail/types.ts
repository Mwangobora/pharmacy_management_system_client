import type { LucideIcon } from 'lucide-react'

export type DetailTone = 'default' | 'danger'

export interface DetailBadgeItem {
  label: string
  tone?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export interface DetailMetricItem {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  tone?: DetailTone
}

export interface DetailInfoItem {
  label: string
  value: string
}
