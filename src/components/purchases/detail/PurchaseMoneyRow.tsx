import { formatTzsCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface PurchaseMoneyRowProps {
  label: string
  value: string
  strong?: boolean
}

export function PurchaseMoneyRow({ label, value, strong = false }: PurchaseMoneyRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-medium text-foreground', strong && 'text-base font-semibold')}>
        {formatTzsCurrency(value)}
      </span>
    </div>
  )
}

