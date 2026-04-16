import type { ReactNode } from 'react'
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
  className?: string
}

interface FormFieldWrapperProps {
  children: ReactNode
  label: string
  htmlFor?: string
  helperText?: string
  error?: string
  className?: string
}

interface FormActionsProps {
  children: ReactNode
  className?: string
}

export function FormLayout({ children, className }: FormLayoutProps) {
  return <div className={cn('mx-auto w-full max-w-3xl space-y-5 px-1', className)}>{children}</div>
}

export function FormSection({ children, title, description, className }: FormSectionProps) {
  return (
    <section className={cn('space-y-4 rounded-xl border border-border/60 p-4 md:p-5', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export function FormFieldWrapper({
  children,
  label,
  htmlFor,
  helperText,
  error,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

export function FormActions({ children, className }: FormActionsProps) {
  return <div className={cn('flex justify-end gap-2 border-t border-border/60 pt-4', className)}>{children}</div>
}
