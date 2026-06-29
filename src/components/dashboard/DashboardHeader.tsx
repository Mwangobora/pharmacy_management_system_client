import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DashboardPeriod } from '@/types/dashboard'

interface DashboardHeaderProps {
  period?: DashboardPeriod
  isRefreshing?: boolean
  onRefresh: () => void
}

export function DashboardHeader({
  period,
  isRefreshing = false,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Owner Dashboard
        </p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Pharmacy performance at a glance
          </h1>
          <p className="text-sm text-muted-foreground">
            {period?.label || 'Select a period to load operational and executive insight.'}
          </p>
          {period?.updated_at ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: {new Intl.DateTimeFormat('en-TZ', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
              }).format(new Date(period.updated_at))}
            </p>
          ) : null}
        </div>
      </div>

      <Button onClick={onRefresh} className="rounded-2xl">
        <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh dashboard
      </Button>
    </div>
  )
}
