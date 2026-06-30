import { toast, type ExternalToast } from 'sonner'
import { NOTIFICATION_CLASSNAMES, NOTIFICATION_DURATIONS } from './config'
import { getApiErrorMessage, getApiErrorStatus } from './error-message'
import type { ApiNotifyOptions, NotifyOptions, NotifyVariant } from './types'

type ToastId = string | number

function buildToastOptions(variant: NotifyVariant, options: NotifyOptions = {}): ExternalToast {
  return {
    id: options.id,
    description: options.description,
    duration: options.persistent ? Number.POSITIVE_INFINITY : (options.duration ?? NOTIFICATION_DURATIONS[variant]),
    closeButton: options.closeButton ?? true,
    className: variant === 'neutral' ? NOTIFICATION_CLASSNAMES.neutral : undefined,
  }
}

function showToast(variant: NotifyVariant, title: string, options?: NotifyOptions): ToastId {
  const toastOptions = buildToastOptions(variant, options)

  if (variant === 'neutral') {
    return toast(title, toastOptions)
  }

  return toast[variant](title, toastOptions)
}

function buildApiErrorTitle(status: number | null) {
  if (status === 401) return 'Session expired'
  if (status === 403) return 'Permission denied'
  if (status === 404) return 'Record not found'
  return 'Request failed'
}

export const notify = {
  success(title: string, options?: NotifyOptions) {
    return showToast('success', title, options)
  },
  error(title: string, options?: NotifyOptions) {
    return showToast('error', title, options)
  },
  warning(title: string, options?: NotifyOptions) {
    return showToast('warning', title, options)
  },
  info(title: string, options?: NotifyOptions) {
    return showToast('info', title, options)
  },
  neutral(title: string, options?: NotifyOptions) {
    return showToast('neutral', title, options)
  },
  apiError(error: unknown, title: string, options?: ApiNotifyOptions) {
    const status = getApiErrorStatus(error)
    const variant = status === 403 ? 'warning' : 'error'

    return showToast(variant, title || buildApiErrorTitle(status), {
      ...options,
      description: getApiErrorMessage(error, options?.fallback),
      persistent: options?.persistent ?? status === 401,
    })
  },
  dismiss(toastId?: ToastId) {
    toast.dismiss(toastId)
  },
}
