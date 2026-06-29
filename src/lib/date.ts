import { format } from 'date-fns'

export function parseDateValue(value: string | null | undefined): Date | null {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: string | null | undefined, fallback = 'Not available'): string {
  const date = parseDateValue(value)
  return date ? format(date, 'PPP') : fallback
}

