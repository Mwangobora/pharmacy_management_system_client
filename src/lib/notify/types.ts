export type NotifyVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral'

export interface NotifyOptions {
  description?: string
  duration?: number
  id?: string | number
  important?: boolean
  persistent?: boolean
  closeButton?: boolean
}

export interface ApiNotifyOptions extends NotifyOptions {
  fallback?: string
}
