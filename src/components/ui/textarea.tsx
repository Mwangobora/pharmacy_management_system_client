import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground/70 aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full rounded-lg border-[1.5px] bg-transparent px-3.5 py-2.5 text-[15px] shadow-xs transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-primary',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
