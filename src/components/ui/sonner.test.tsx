import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NOTIFICATION_CLASSNAMES, NOTIFICATION_Z_INDEX } from '@/lib/notify'

const sonnerSpy = vi.hoisted(() => vi.fn<(props: Record<string, unknown>) => null>(() => null))

interface MockedToasterProps {
  className: string
  closeButton: boolean
  richColors: boolean
  visibleToasts: number
  offset: number
  style: Record<string, string>
  toastOptions: {
    classNames: Record<string, string>
  }
}

vi.mock('@/themes/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'dark' }),
}))

vi.mock('sonner', () => ({
  Toaster: sonnerSpy,
}))

import { Toaster } from './sonner'

describe('Toaster', () => {
  it('mounts Sonner with semantic class names and a high z-index', () => {
    render(<Toaster position="top-right" />)

    expect(sonnerSpy).toHaveBeenCalled()
    const firstCall = sonnerSpy.mock.calls[0] as [Record<string, unknown>] | undefined
    expect(firstCall).toBeDefined()
    const props = firstCall?.[0] as MockedToasterProps | undefined

    expect(props).toBeDefined()
    if (!props) return

    expect(props.className).toContain(NOTIFICATION_Z_INDEX)
    expect(props.closeButton).toBe(true)
    expect(props.richColors).toBe(true)
    expect(props.visibleToasts).toBe(5)
    expect(props.offset).toBe(20)
    expect(props.style).toMatchObject({
      '--success-bg': 'hsl(var(--success-background))',
      '--error-bg': 'hsl(var(--error-background))',
      '--warning-bg': 'hsl(var(--warning-background))',
      '--info-bg': 'hsl(var(--info-background))',
    })
    expect(props.toastOptions.classNames.success).toBe(NOTIFICATION_CLASSNAMES.success)
    expect(props.toastOptions.classNames.error).toBe(NOTIFICATION_CLASSNAMES.error)
    expect(props.toastOptions.classNames.warning).toBe(NOTIFICATION_CLASSNAMES.warning)
    expect(props.toastOptions.classNames.info).toBe(NOTIFICATION_CLASSNAMES.info)
  })
})
