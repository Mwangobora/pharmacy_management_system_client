import type { ApiError } from '@/api/HttpClient'

const GENERIC_MESSAGES = new Set([
  'An error occurred',
  'Request failed',
  'Operation failed',
  'Something went wrong',
])

const HIDDEN_DETAIL_KEYS = new Set([
  'traceback',
  'stack',
  'exception',
  'errors',
])

function humanizeFieldName(field: string) {
  return field
    .replace(/_/g, ' ')
    .replace(/\bid\b/g, 'ID')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function coerceDetailMessage(value: unknown): string | null {
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
    return parts.length ? parts.join(' ') : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }

  return null
}

function formatDetails(details: unknown) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return null
  }

  const record = details as Record<string, unknown>
  const detailEntries = Object.entries(record)
    .filter(([key]) => !HIDDEN_DETAIL_KEYS.has(key))
    .map(([key, value]) => {
      const message = coerceDetailMessage(value)
      if (!message) return null
      if (key === 'detail' || key === 'message' || key === 'non_field_errors') {
        return message
      }
      return `${humanizeFieldName(key)}: ${message}`
    })
    .filter((value): value is string => Boolean(value))

  return detailEntries[0] ?? null
}

export function getApiErrorStatus(error: unknown) {
  if (!error || typeof error !== 'object') return null
  const status = (error as Partial<ApiError>).status
  return typeof status === 'number' ? status : null
}

export function getApiErrorMessage(error: unknown, fallback = 'The request could not be completed.') {
  const status = getApiErrorStatus(error)

  if (status === 401) {
    return 'Your session has expired. Please sign in again to continue.'
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (status === 404) {
    return 'The requested record could not be found.'
  }

  const detailsMessage = formatDetails((error as Partial<ApiError> | null)?.details)
  if (detailsMessage) return detailsMessage

  const message = (error as Partial<ApiError> | null)?.message?.trim()
  if (message && !GENERIC_MESSAGES.has(message)) return message

  return fallback
}
