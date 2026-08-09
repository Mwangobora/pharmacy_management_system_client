import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface FormLayoutProps {
  children: ReactNode
  className?: string
}

interface FormSectionProps {
  children: ReactNode
  title?: string
  description?: string
  icon?: LucideIcon
  className?: string
}

interface FormFieldWrapperProps {
  children: ReactNode
  label: string
  htmlFor?: string
  helperText?: string
  error?: string
  required?: boolean
  className?: string
}

interface FormActionsProps {
  children: ReactNode
  className?: string
}

export function FormLayout({ children, className }: FormLayoutProps) {
  return <div className={cn('mx-auto w-full max-w-3xl space-y-8 px-1', className)}>{children}</div>
}

export function FormSection({ children, title, description, icon: Icon, className }: FormSectionProps) {
  return (
    <section className={cn('space-y-5 border-b border-border/60 pb-8 last:border-b-0 last:pb-0', className)}>
      {(title || description) && (
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function FormFieldWrapper({
  children,
  label,
  htmlFor,
  helperText,
  error,
  required,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('-mx-1 flex flex-col-reverse justify-end gap-3 px-1 pt-2 sm:flex-row', className)}>
      {children}
    </div>
  )
}
