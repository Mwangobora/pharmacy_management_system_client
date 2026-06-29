import { useMemo } from 'react'
import { DashboardEmptyState } from '../DashboardEmptyState'

interface TrendChartProps {
  data: Array<{ label: string; value: number | null | undefined }>
  valueLabel: string
}

export function TrendChart({
  data,
  valueLabel,
}: TrendChartProps) {
  const points = useMemo(() => {
    const safe = data.filter((item) => item.value !== null && item.value !== undefined)
    if (safe.length === 0) return []
    const max = Math.max(...safe.map((item) => item.value || 0), 1)
    return safe.map((item, index) => {
      const x = safe.length === 1 ? 180 : (index / (safe.length - 1)) * 360
      const y = 160 - (((item.value || 0) / max) * 130)
      return `${x},${y}`
    })
  }, [data])

  if (points.length === 0) {
    return (
      <DashboardEmptyState
        title="No trend data"
        description="There is not enough activity in the selected period to draw a chart."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-48 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-4">
        <svg viewBox="0 0 360 170" className="h-full w-full">
          <defs>
            <linearGradient id="dashboard-line" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.join(' ')}
          />
        </svg>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {data.slice(-4).map((item) => (
          <div key={`${item.label}-${valueLabel}`} className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium">
              {valueLabel}: {item.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
