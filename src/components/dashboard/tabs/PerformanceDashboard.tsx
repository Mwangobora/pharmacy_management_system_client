import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardSection } from '../DashboardSection'
import { RankedBars } from '../charts/RankedBars'
import { useDashboardPerformance } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTzsCurrency } from '@/lib/currency'

interface PerformanceDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function PerformanceDashboard({ filters, active }: PerformanceDashboardProps) {
  const { data, isLoading, isError } = useDashboardPerformance(filters, active)

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Performance dashboard unavailable" description="Performance comparisons could not be loaded right now." />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardSection title="Identified customers">
          <p className="text-3xl font-semibold">{data.growth_indicators.identified_customers}</p>
        </DashboardSection>
        <DashboardSection title="Repeat customer rate">
          <p className="text-3xl font-semibold">{data.growth_indicators.repeat_customer_rate === null ? 'N/A' : `${data.growth_indicators.repeat_customer_rate.toFixed(1)}%`}</p>
        </DashboardSection>
        <DashboardSection title="Average basket value">
          <p className="text-3xl font-semibold">{formatTzsCurrency(data.growth_indicators.average_basket_value)}</p>
        </DashboardSection>
        <DashboardSection title="Sales volume">
          <p className="text-3xl font-semibold">{data.growth_indicators.sales_volume}</p>
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Category contribution">
          <RankedBars
            data={data.category_performance.map((item) => ({
              label: item.category,
              value: item.revenue,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>

        <DashboardSection title="Cashier performance">
          {!data.staff_visible ? (
            <DashboardEmptyState title="Staff performance is restricted" description="This account does not have permission to view employee comparisons." />
          ) : (
            <RankedBars
              data={data.cashier_performance.map((item) => ({
                label: `${item.name} · ${item.sales_count} sales`,
                value: item.revenue,
              }))}
              valueFormatter={formatTzsCurrency}
            />
          )}
        </DashboardSection>
      </div>
    </div>
  )
}
