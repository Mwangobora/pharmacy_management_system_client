import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DetailTone } from '@/types/medicine-detail'

interface MedicineTimelineCardProps {
  icon: LucideIcon
  label: string
  value: string
  caption: string
  tone?: DetailTone
}

export function MedicineTimelineCard({
  icon: Icon,
  label,
  value,
  caption,
  tone = 'default',
}: MedicineTimelineCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-muted/30 p-4',
        tone === 'danger' && 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30',
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn('h-4 w-4', tone === 'danger' && 'text-red-500')} />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-base font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
    </div>
  )
}

