import { formatTzsCurrency } from '@/lib/currency'

export function formatDashboardValue(value: number | null | undefined, asPercent = false) {
  if (value === null || value === undefined) return 'Restricted'
  if (asPercent) return `${value.toFixed(1)}%`
  return formatTzsCurrency(value)
}

export function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return 'Restricted'
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatPercentChange(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat('en-TZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
