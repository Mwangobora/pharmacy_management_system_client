import { DashboardEmptyState } from '../DashboardEmptyState'
import { DashboardKpiGrid } from '../DashboardKpiGrid'
import { DashboardSection } from '../DashboardSection'
import { RankedBars } from '../charts/RankedBars'
import { useDashboardInventory } from '@/hooks/queries/useDashboard'
import type { DashboardQueryParams } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

interface InventoryDashboardProps {
  filters: DashboardQueryParams
  active: boolean
}

export function InventoryDashboard({ filters, active }: InventoryDashboardProps) {
  const { data, isLoading, isError } = useDashboardInventory(filters, active)

  if (isLoading) return <Skeleton className="h-[520px] rounded-3xl" />
  if (isError || !data) return <DashboardEmptyState title="Inventory dashboard unavailable" description="Inventory insight could not be loaded right now." />

  return (
    <div className="space-y-6">
      <DashboardKpiGrid metrics={data.summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Stock status breakdown">
          <RankedBars
            data={Object.entries(data.stock_status).map(([label, value]) => ({
              label: label.replaceAll('_', ' '),
              value,
            }))}
          />
        </DashboardSection>

        <DashboardSection title="Stock movement trend">
          <RankedBars
            data={data.stock_movements.map((item) => ({
              label: `${item.transaction_type} · ${item.label}`,
              value: item.quantity,
            }))}
          />
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Low-stock table" description="Medicines that require reorder attention.">
          <div className="space-y-3">
            {data.low_stock.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.medicine}</p>
                    <p className="text-sm text-muted-foreground">{item.supplier}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{item.current_stock} in stock</p>
                    <p className="text-muted-foreground">Short by {item.shortage_quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Expiry monitoring" description="Mutually exclusive expiry windows.">
          <div className="space-y-4">
            {Object.entries(data.expiry_monitoring).map(([key, rows]) => (
              <div key={key}>
                <p className="mb-2 text-sm font-medium capitalize">{key.replaceAll('_', ' ')}</p>
                {rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No batches in this window.</p>
                ) : (
                  <div className="space-y-2">
                    {rows.slice(0, 4).map((row) => (
                      <div key={row.id} className="rounded-2xl border border-border/60 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span>{row.medicine}</span>
                          <span className="text-muted-foreground">{row.days_to_expiry} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>

      <DashboardSection title="Slow-moving and dead stock">
        <RankedBars
          data={data.slow_moving.map((item) => ({
            label: item.medicine,
            value: item.stock_value,
          }))}
        />
      </DashboardSection>
    </div>
  )
}
