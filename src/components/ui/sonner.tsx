'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { NOTIFICATION_CLASSNAMES } from '@/lib/notify'
import { useTheme } from '@/themes/ThemeProvider'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group !z-[120]"
      closeButton
      expand
      richColors
      visibleToasts={5}
      offset={20}
      toastOptions={{
        classNames: {
          toast: NOTIFICATION_CLASSNAMES.toast,
          title: NOTIFICATION_CLASSNAMES.title,
          description: NOTIFICATION_CLASSNAMES.description,
          closeButton: NOTIFICATION_CLASSNAMES.closeButton,
          actionButton: NOTIFICATION_CLASSNAMES.actionButton,
          cancelButton: NOTIFICATION_CLASSNAMES.cancelButton,
          success: NOTIFICATION_CLASSNAMES.success,
          error: NOTIFICATION_CLASSNAMES.error,
          warning: NOTIFICATION_CLASSNAMES.warning,
          info: NOTIFICATION_CLASSNAMES.info,
        },
      }}
      style={
        {
          '--normal-bg': 'hsl(var(--popover))',
          '--normal-text': 'hsl(var(--popover-foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(var(--success-background))',
          '--success-border': 'hsl(var(--success-border))',
          '--success-text': 'hsl(var(--success-foreground))',
          '--error-bg': 'hsl(var(--error-background))',
          '--error-border': 'hsl(var(--error-border))',
          '--error-text': 'hsl(var(--error-foreground))',
          '--warning-bg': 'hsl(var(--warning-background))',
          '--warning-border': 'hsl(var(--warning-border))',
          '--warning-text': 'hsl(var(--warning-foreground))',
          '--info-bg': 'hsl(var(--info-background))',
          '--info-border': 'hsl(var(--info-border))',
          '--info-text': 'hsl(var(--info-foreground))',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
