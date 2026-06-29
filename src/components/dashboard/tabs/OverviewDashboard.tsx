import { useMemo, useState } from 'react'
import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardKpiGrid } from '../DashboardKpiGrid'
import { DashboardSection } from '../DashboardSection'
import { TrendChart } from '../charts/TrendChart'
import { RankedBars } from '../charts/RankedBars'
import { RecentSalesTable } from '../tables/RecentSalesTable'
import { useDashboardOverview } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTzsCurrency } from '@/lib/currency'

interface OverviewDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function OverviewDashboard({
  filters,
  active,
}: OverviewDashboardProps) {
  const [trendMetric, setTrendMetric] = useState<'revenue' | 'gross_profit' | 'sales'>('revenue')
  const { data, isLoading, isError } = useDashboardOverview(filters, active)

  const trendData = useMemo(() => (
    data?.trend.series.map((item) => ({
      label: item.label,
      value: trendMetric === 'revenue'
        ? item.revenue
        : trendMetric === 'gross_profit'
          ? item.gross_profit
          : item.sales,
    })) || []
  ), [data?.trend.series, trendMetric])

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Dashboard unavailable" description="The overview endpoint could not be loaded right now." />

  return (
    <div className="space-y-6">
      <DashboardKpiGrid metrics={data.summary} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardSection
          title="Revenue trend"
          description="Switch between revenue, estimated gross profit, and sales count."
          action={
            <div className="flex gap-2">
              {(['revenue', 'gross_profit', 'sales'] as const).map((metric) => (
                <Button key={metric} size="sm" variant={trendMetric === metric ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setTrendMetric(metric)}>
                  {metric.replace('_', ' ')}
                </Button>
              ))}
            </div>
          }
        >
          <TrendChart data={trendData} valueLabel={trendMetric.replace('_', ' ')} />
        </DashboardSection>

        <DashboardSection title="Urgent attention" description="Problems that need action today.">
          {data.alerts.length === 0 ? (
            <DashboardEmptyState title="No urgent alerts" description="Critical stock and payment alerts will surface here automatically." />
          ) : (
            <div className="space-y-3">
              {data.alerts.map((alert) => (
                <a key={alert.key} href={alert.href} className="block rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 transition hover:bg-muted/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{alert.label}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{alert.severity}</p>
                    </div>
                    <span className="text-lg font-semibold">{alert.count}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardSection title="Sales and profit summary">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Revenue</span><span className="font-medium">{formatTzsCurrency(data.profit_summary.revenue)}</span></div>
            <div className="flex items-center justify-between"><span>Estimated gross profit</span><span className="font-medium">{data.profit_summary.estimated_gross_profit === null ? 'Restricted' : formatTzsCurrency(data.profit_summary.estimated_gross_profit)}</span></div>
            <div className="flex items-center justify-between"><span>Estimated refund value</span><span className="font-medium">{formatTzsCurrency(data.profit_summary.refund_estimate)}</span></div>
            <div className="flex items-center justify-between"><span>Outstanding balance</span><span className="font-medium">{formatTzsCurrency(data.profit_summary.outstanding_balance)}</span></div>
          </div>
        </DashboardSection>

        <DashboardSection title="Top-selling medicines" description="Ranked by quantity sold in the selected period.">
          <RankedBars
            data={data.top_selling.map((item) => ({
              label: item.name || 'Unknown',
              value: item.quantity_sold || 0,
            }))}
          />
        </DashboardSection>

        <DashboardSection title="Payment methods" description="Collected payments in the current period.">
          <RankedBars
            data={data.payment_breakdown.map((item) => ({
              label: item.payment_method,
              value: item.revenue,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>
      </div>

      <DashboardSection title="Recent sales" description="Latest recorded sales without loading the full history.">
        <RecentSalesTable rows={data.recent_sales} />
      </DashboardSection>
    </div>
  )
}
