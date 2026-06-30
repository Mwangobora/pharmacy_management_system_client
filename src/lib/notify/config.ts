import { CheckCircle2, AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NotifyVariant } from './types'

export const NOTIFICATION_DURATIONS: Record<NotifyVariant, number> = {
  success: 4500,
  info: 4500,
  neutral: 5000,
  warning: 7000,
  error: 9000,
}

export const NOTIFICATION_Z_INDEX = 'z-[120]'

const baseToastClassName = cn(
  'pointer-events-auto rounded-2xl border shadow-lg backdrop-blur-sm',
  'px-4 py-3 gap-3',
  'data-[mounted=true]:animate-in data-[mounted=true]:fade-in-0 data-[mounted=true]:slide-in-from-top-2',
  'data-[removed=true]:animate-out data-[removed=true]:fade-out-0 data-[removed=true]:slide-out-to-top-2',
  'data-[swiping=true]:translate-x-[var(--swipe-amount)]',
  'data-[swipe-out=true]:animate-out data-[swipe-out=true]:slide-out-to-right-full',
  'transition-all duration-200 ease-out',
  NOTIFICATION_Z_INDEX
)

export const NOTIFICATION_CLASSNAMES = {
  toast: baseToastClassName,
  title: 'text-[0.95rem] font-semibold leading-5',
  description: 'mt-1 text-sm leading-5 opacity-95',
  closeButton: cn(
    'border-none shadow-none',
    'bg-transparent text-current opacity-80',
    'hover:bg-black/5 hover:opacity-100',
    'dark:hover:bg-white/10'
  ),
  actionButton: 'rounded-xl bg-foreground text-background',
  cancelButton: 'rounded-xl border border-current/15 bg-transparent text-current',
  success: 'border-[hsl(var(--success-border))] bg-[hsl(var(--success-background))] text-[hsl(var(--success-foreground))]',
  error: 'border-[hsl(var(--error-border))] bg-[hsl(var(--error-background))] text-[hsl(var(--error-foreground))]',
  warning: 'border-[hsl(var(--warning-border))] bg-[hsl(var(--warning-background))] text-[hsl(var(--warning-foreground))]',
  info: 'border-[hsl(var(--info-border))] bg-[hsl(var(--info-background))] text-[hsl(var(--info-foreground))]',
  neutral: 'border-[hsl(var(--border))] bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
} as const

export const NOTIFICATION_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  neutral: Bell,
}
