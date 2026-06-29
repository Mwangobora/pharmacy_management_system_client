import type { DashboardMetric } from '@/types/dashboard'
import { DashboardKpiCard } from './DashboardKpiCard'

interface DashboardKpiGridProps {
  metrics: DashboardMetric[]
}

export function DashboardKpiGrid({ metrics }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardKpiCard key={metric.key} metric={metric} />
      ))}
    </div>
  )
}
