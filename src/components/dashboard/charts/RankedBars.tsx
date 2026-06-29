import { DashboardEmptyState } from '../DashboardEmptyState'

interface RankedBarsProps {
  data: Array<{ label: string; value: number }>
  valueFormatter?: (value: number) => string
}

export function RankedBars({
  data,
  valueFormatter = (value) => value.toString(),
}: RankedBarsProps) {
  if (data.length === 0) {
    return (
      <DashboardEmptyState
        title="No ranked data"
        description="This section will populate automatically when matching activity exists."
      />
    )
  }

  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="truncate font-medium">{item.label}</p>
            <span className="text-muted-foreground">{valueFormatter(item.value)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted">
            <div
              className="h-2.5 rounded-full bg-primary"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
