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
        <p className="text-base font-semibold uppercase tracking-[0.16em] text-primary">
          Owner Dashboard
        </p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Pharmacy performance at a glance
          </h1>
          <p className="text-lg text-muted-foreground">
            {period?.label || 'Select a period to load operational and executive insight.'}
          </p>
          {period?.updated_at ? (
            <p className="mt-1 text-base text-muted-foreground">
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

      <Button onClick={onRefresh} size="lg" className="rounded-2xl text-base">
        <RefreshCcw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh dashboard
      </Button>
    </div>
  )
}
