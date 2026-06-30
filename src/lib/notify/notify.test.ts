import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NOTIFICATION_CLASSNAMES, NOTIFICATION_DURATIONS } from './config'

const toastMock = vi.hoisted(() => {
  const base = vi.fn()
  return Object.assign(base, {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  })
})

vi.mock('sonner', () => ({
  toast: toastMock,
}))

import { notify } from './notify'

describe('notify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes success notifications to the success variant with the correct duration', () => {
    notify.success('Sale completed successfully')

    expect(toastMock.success).toHaveBeenCalledWith(
      'Sale completed successfully',
      expect.objectContaining({
        duration: NOTIFICATION_DURATIONS.success,
        closeButton: true,
      })
    )
  })

  it('uses the neutral toast with the shared neutral class name', () => {
    notify.neutral('Background sync finished')

    expect(toastMock).toHaveBeenCalledWith(
      'Background sync finished',
      expect.objectContaining({
        className: NOTIFICATION_CLASSNAMES.neutral,
        duration: NOTIFICATION_DURATIONS.neutral,
      })
    )
  })

  it('keeps critical errors visible until dismissed', () => {
    notify.error('Payment failed', { persistent: true })

    expect(toastMock.error).toHaveBeenCalledWith(
      'Payment failed',
      expect.objectContaining({
        duration: Number.POSITIVE_INFINITY,
      })
    )
  })

  it('uses warning semantics for permission failures', () => {
    notify.apiError(
      {
        status: 403,
        message: 'Forbidden',
      },
      'Refund could not be completed',
      {
        fallback: 'You do not have permission to refund this sale.',
      }
    )

    expect(toastMock.warning).toHaveBeenCalledWith(
      'Refund could not be completed',
      expect.objectContaining({
        duration: NOTIFICATION_DURATIONS.warning,
        description: 'You do not have permission to perform this action.',
      })
    )
  })

  it('dismisses notifications through the central wrapper', () => {
    notify.dismiss('sale-error')

    expect(toastMock.dismiss).toHaveBeenCalledWith('sale-error')
  })
})
