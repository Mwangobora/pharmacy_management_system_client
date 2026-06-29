import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardKpiGrid } from '../DashboardKpiGrid'
import { DashboardSection } from '../DashboardSection'
import { TrendChart } from '../charts/TrendChart'
import { RankedBars } from '../charts/RankedBars'
import { useDashboardSales } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTzsCurrency } from '@/lib/currency'

interface SalesDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function SalesDashboard({ filters, active }: SalesDashboardProps) {
  const { data, isLoading, isError } = useDashboardSales(filters, active)

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Sales dashboard unavailable" description="Sales analytics could not be loaded right now." />

  return (
    <div className="space-y-6">
      <DashboardKpiGrid metrics={data.summary} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardSection title="Sales trend" description="Revenue progression over the selected period.">
          <TrendChart
            data={data.trend.map((item) => ({ label: item.label, value: item.revenue }))}
            valueLabel="revenue"
          />
        </DashboardSection>

        <DashboardSection title="Sales by hour" description="Busy and quiet times across the day.">
          <RankedBars
            data={data.sales_by_time.by_hour.map((item) => ({
              label: `${String(item.hour ?? 0).padStart(2, '0')}:00`,
              value: item.revenue,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardSection title="Top by quantity">
          <RankedBars
            data={data.top_by_quantity.map((item) => ({
              label: item.name || 'Unknown',
              value: item.quantity_sold || 0,
            }))}
          />
        </DashboardSection>

        <DashboardSection title="Top by revenue">
          <RankedBars
            data={data.top_by_revenue.map((item) => ({
              label: item.name || 'Unknown',
              value: item.revenue || 0,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>

        <DashboardSection title="Payment method analysis">
          <RankedBars
            data={data.payment_methods.map((item) => ({
              label: `${item.payment_method} (${item.transactions})`,
              value: item.revenue,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Category performance">
          <RankedBars
            data={data.by_category.map((item) => ({
              label: item.category,
              value: item.revenue,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>

        <DashboardSection title="Slow-moving medicines" description="Products with stock but no sales in the selected period.">
          <RankedBars
            data={data.slow_moving.map((item) => ({
              label: item.name,
              value: item.stock_value,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>
      </div>
    </div>
  )
}
