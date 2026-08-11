import { useMemo } from 'react'
import { DashboardEmptyState } from '../DashboardEmptyState'

interface TrendChartProps {
  data: Array<{ label: string; value: number | null | undefined }>
  valueLabel: string
  valueFormatter?: (value: number) => string
}

const CHART_WIDTH = 360
const CHART_HEIGHT = 170
const TOP_PADDING = 12
const BOTTOM_PADDING = 12
const USABLE_HEIGHT = CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING

function formatAxisLabel(label: string) {
  const date = new Date(label)
  if (Number.isNaN(date.getTime())) return label
  return new Intl.DateTimeFormat('en-TZ', { day: '2-digit', month: 'short' }).format(date)
}

export function TrendChart({
  data,
  valueLabel,
  valueFormatter = (value) => value.toLocaleString(),
}: TrendChartProps) {
  const { points, coords, safe } = useMemo(() => {
    const safeData = data.filter((item) => item.value !== null && item.value !== undefined)
    if (safeData.length === 0) return { points: '', coords: [] as { x: number; y: number; item: typeof data[number] }[], safe: safeData }
    const maxValue = Math.max(...safeData.map((item) => item.value || 0), 1)
    const xy = safeData.map((item, index) => {
      const x = safeData.length === 1 ? CHART_WIDTH / 2 : (index / (safeData.length - 1)) * CHART_WIDTH
      const y = TOP_PADDING + USABLE_HEIGHT - (((item.value || 0) / maxValue) * USABLE_HEIGHT)
      return { x, y, item }
    })
    return { points: xy.map((p) => `${p.x},${p.y}`).join(' '), coords: xy, safe: safeData }
  }, [data])

  if (coords.length === 0) {
    return (
      <DashboardEmptyState
        title="No trend data"
        description="There is not enough activity in the selected period to draw a chart."
      />
    )
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1]
  const areaPath = `M${coords[0].x},${CHART_HEIGHT - BOTTOM_PADDING} L${points} L${coords[coords.length - 1].x},${CHART_HEIGHT - BOTTOM_PADDING} Z`
  const firstLabel = formatAxisLabel(safe[0].label)
  const lastLabel = formatAxisLabel(safe[safe.length - 1].label)
  const midLabel = safe.length > 2 ? formatAxisLabel(safe[Math.floor((safe.length - 1) / 2)].label) : null

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-muted/30 p-4">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 20}`} className="h-56 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dashboard-line" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {gridLines.map((fraction) => {
            const y = TOP_PADDING + USABLE_HEIGHT * fraction
            return (
              <line
                key={fraction}
                x1={0}
                x2={CHART_WIDTH}
                y1={y}
                y2={y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray={fraction === 1 ? undefined : '4 4'}
              />
            )
          })}

          <path d={areaPath} fill="url(#dashboard-line)" stroke="none" />

          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {coords.map((point, index) => (
            <circle
              key={`${point.item.label}-${index}`}
              cx={point.x}
              cy={point.y}
              r={coords.length > 40 ? 0 : 4}
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
            />
          ))}

          <text x={0} y={CHART_HEIGHT + 16} fontSize="12.5" fill="hsl(var(--muted-foreground))">
            {firstLabel}
          </text>
          {midLabel && (
            <text x={CHART_WIDTH / 2} y={CHART_HEIGHT + 16} fontSize="12.5" fill="hsl(var(--muted-foreground))" textAnchor="middle">
              {midLabel}
            </text>
          )}
          <text x={CHART_WIDTH} y={CHART_HEIGHT + 16} fontSize="12.5" fill="hsl(var(--muted-foreground))" textAnchor="end">
            {lastLabel}
          </text>
        </svg>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {data.slice(-4).map((item) => (
          <div key={`${item.label}-${valueLabel}`} className="rounded-2xl border border-border/60 bg-background/70 px-3.5 py-2.5">
            <p className="text-base text-muted-foreground">{formatAxisLabel(item.label)}</p>
            <p className="text-lg font-semibold capitalize">
              {valueFormatter(item.value ?? 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
