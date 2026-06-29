import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DetailTone } from '@/types/medicine-detail'

interface MedicineMetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  tone?: DetailTone
}

export function MedicineMetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
}: MedicineMetricCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-white/60 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5',
        tone === 'danger' && 'border-red-200/80 bg-red-50/80 dark:border-red-900/40 dark:bg-red-950/30',
      )}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
          <Icon className={cn('h-4 w-4 text-muted-foreground', tone === 'danger' && 'text-red-500')} />
        </div>
        <div
          className={cn(
            'text-xl font-semibold tracking-tight',
            tone === 'danger' && 'text-red-600 dark:text-red-300',
          )}
        >
          {value}
        </div>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

