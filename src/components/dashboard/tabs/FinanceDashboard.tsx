import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardKpiGrid } from '../DashboardKpiGrid'
import { DashboardSection } from '../DashboardSection'
import { TrendChart } from '../charts/TrendChart'
import { RankedBars } from '../charts/RankedBars'
import { useDashboardFinance } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTzsCurrency } from '@/lib/currency'

interface FinanceDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function FinanceDashboard({ filters, active }: FinanceDashboardProps) {
  const { data, isLoading, isError } = useDashboardFinance(filters, active)

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Finance dashboard unavailable" description="Finance analytics could not be loaded right now." />

  return (
    <div className="space-y-6">
      <DashboardKpiGrid metrics={data.summary} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardSection title="Profit trend" description="Revenue versus refund pressure across the selected period.">
          <TrendChart
            data={data.trend.map((item) => ({ label: item.label, value: item.revenue }))}
            valueLabel="revenue"
          />
        </DashboardSection>

        <DashboardSection title="Cash flow summary">
          <RankedBars
            data={data.cash_flow.inflows.map((item) => ({
              label: item.payment_method,
              value: item.amount,
            }))}
            valueFormatter={formatTzsCurrency}
          />
        </DashboardSection>
      </div>

      {!data.profit_visible ? (
        <DashboardEmptyState
          title="Profit details are restricted"
          description="This account can see finance totals, but detailed profit and margin values require an additional permission."
        />
      ) : null}
    </div>
  )
}
