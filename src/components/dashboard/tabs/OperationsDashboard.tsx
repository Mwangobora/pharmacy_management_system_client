import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardKpiGrid } from '../DashboardKpiGrid'
import { DashboardSection } from '../DashboardSection'
import { useDashboardOperations } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

interface OperationsDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function OperationsDashboard({ filters, active }: OperationsDashboardProps) {
  const { data, isLoading, isError } = useDashboardOperations(filters, active)

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Operations dashboard unavailable" description="Operational monitoring could not be loaded right now." />

  return (
    <div className="space-y-6">
      <DashboardKpiGrid metrics={data.summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Pending actions" description="Actionable exceptions from live workflows.">
          {data.pending_actions.length === 0 ? (
            <DashboardEmptyState title="No pending actions" description="Follow-up records will appear here when payment and workflow exceptions exist." />
          ) : (
            <div className="space-y-3">
              {data.pending_actions.map((item) => (
                <a key={`${item.reference}-${item.created_at}`} href={item.href} className="block rounded-2xl border border-border/70 px-4 py-3 hover:bg-muted/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.reference}</p>
                      <p className="text-sm text-muted-foreground">{item.type} · {item.assigned_user}</p>
                    </div>
                    <div className="text-right text-sm uppercase tracking-[0.14em] text-muted-foreground">
                      <p>{item.priority}</p>
                      <p>{item.status}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection title="Exception monitoring">
          <div className="space-y-3">
            {data.exceptions.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/70 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{item.status.replaceAll('_', ' ')}</p>
                  </div>
                  <span className="text-2xl font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>
    </div>
  )
}
