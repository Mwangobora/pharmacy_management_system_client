import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PurchaseMetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}

export function PurchaseMetricCard({ icon: Icon, label, value, hint }: PurchaseMetricCardProps) {
  return (
    <Card className="rounded-2xl border-white/60 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-xl font-semibold tracking-tight">{value}</div>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

