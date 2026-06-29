import { ArrowDownRight, ArrowUpRight, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardMetric } from '@/types/dashboard'
import {
  formatCompactNumber,
  formatDashboardValue,
  formatPercentChange,
} from './dashboardFormatters'

interface DashboardKpiCardProps {
  metric: DashboardMetric
  compact?: boolean
}

export function DashboardKpiCard({
  metric,
  compact = false,
}: DashboardKpiCardProps) {
  const change = formatPercentChange(metric.percentage_change)
  const positive = (metric.percentage_change || 0) >= 0
  const isCount = ['sales_count', 'items_sold', 'low_stock', 'expired', 'out_of_stock_items', 'active_medicines', 'available_batches', 'refund_events'].includes(metric.key)
  const value = metric.restricted
    ? 'Restricted'
    : isCount
      ? formatCompactNumber(metric.value)
      : formatDashboardValue(metric.value, metric.key.includes('margin'))

  return (
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardContent className={compact ? 'space-y-2 p-4' : 'space-y-3 p-5'}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {metric.label}
            </p>
            <p className={compact ? 'text-2xl font-semibold' : 'text-3xl font-semibold'}>
              {value}
            </p>
          </div>
          {metric.restricted ? (
            <span className="rounded-full bg-muted p-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </span>
          ) : null}
        </div>

        {metric.comparison_available && change ? (
          <div className={`flex items-center gap-2 text-xs ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span>{change} compared with previous period</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {metric.restricted ? 'Requires elevated permission' : 'Comparison unavailable'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
