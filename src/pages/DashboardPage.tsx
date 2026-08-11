import { startTransition, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FinanceDashboard } from '@/components/dashboard/tabs/FinanceDashboard'
import { InventoryDashboard } from '@/components/dashboard/tabs/InventoryDashboard'
import { OperationsDashboard } from '@/components/dashboard/tabs/OperationsDashboard'
import { OverviewDashboard } from '@/components/dashboard/tabs/OverviewDashboard'
import { PerformanceDashboard } from '@/components/dashboard/tabs/PerformanceDashboard'
import { SalesDashboard } from '@/components/dashboard/tabs/SalesDashboard'
import { useDashboardFiltersOptions } from '@/hooks/queries/useDashboard'
import { useDashboardFilters } from '@/hooks/dashboard/useDashboardFilters'
import { usePermissions } from '@/hooks/usePermissions'
import { notify } from '@/lib/notify'
import type { DashboardPreset } from '@/types/dashboard'

const dashboardTabs = [
  { value: 'overview', label: 'Overview', permission: 'dashboard.overview.view' },
  { value: 'sales', label: 'Sales', permission: 'dashboard.sales.view' },
  { value: 'inventory', label: 'Inventory', permission: 'dashboard.inventory.view' },
  { value: 'finance', label: 'Finance', permission: 'dashboard.finance.view' },
  { value: 'operations', label: 'Operations', permission: 'dashboard.operations.view' },
  { value: 'performance', label: 'Performance', permission: 'dashboard.performance.view' },
] as const

export default function DashboardPage() {
  const permissions = usePermissions()
  const availableTabs = useMemo(
    () => dashboardTabs.filter((tab) => permissions.includes(tab.permission)),
    [permissions]
  )
  const [activeTab, setActiveTab] = useState<string>(availableTabs[0]?.value ?? 'overview')
  const filterState = useDashboardFilters()
  const { data: filterOptions, refetch, isFetching } = useDashboardFiltersOptions()
  const presetLabels: Record<DashboardPreset, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    last_7_days: 'Last 7 days',
    last_30_days: 'Last 30 days',
    this_month: 'This month',
    last_month: 'Last month',
    this_quarter: 'This quarter',
    this_year: 'This year',
    custom: filterState.dateFrom && filterState.dateTo
      ? `${new Intl.DateTimeFormat('en-TZ', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(filterState.dateFrom))} - ${new Intl.DateTimeFormat('en-TZ', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(filterState.dateTo))}`
      : 'Custom range',
  }

  const refreshDashboard = async () => {
    await refetch()
    notify.info('Dashboard data refreshed', {
      description: 'Latest pharmacy data has been loaded.',
    })
  }

  if (availableTabs.length === 0) {
    return (
      <DashboardEmptyState
        title="No dashboard access"
        description="This account does not currently have permission to view any dashboard tab."
      />
    )
  }

  return (
    <div className="space-y-6 text-[15px] md:text-base">
      <DashboardHeader
        period={{ preset: filterState.preset, date_from: '', date_to: '', label: presetLabels[filterState.preset] }}
        isRefreshing={isFetching}
        onRefresh={refreshDashboard}
      />

      <DashboardFilters
        preset={filterState.preset}
        dateFrom={filterState.dateFrom}
        dateTo={filterState.dateTo}
        cashierId={filterState.cashierId}
        paymentMethod={filterState.paymentMethod}
        options={filterOptions}
        onPresetChange={filterState.setPreset}
        onDateFromChange={filterState.setDateFrom}
        onDateToChange={filterState.setDateTo}
        onCashierChange={filterState.setCashierId}
        onPaymentMethodChange={filterState.setPaymentMethod}
      />

      <Tabs value={activeTab} onValueChange={(value) => startTransition(() => setActiveTab(value))} className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-3xl bg-muted/50 p-2">
          {availableTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-2xl px-4 py-2 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewDashboard filters={filterState.queryParams} active={activeTab === 'overview'} />
        </TabsContent>
        <TabsContent value="sales">
          <SalesDashboard filters={filterState.queryParams} active={activeTab === 'sales'} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryDashboard filters={filterState.queryParams} active={activeTab === 'inventory'} />
        </TabsContent>
        <TabsContent value="finance">
          <FinanceDashboard filters={filterState.queryParams} active={activeTab === 'finance'} />
        </TabsContent>
        <TabsContent value="operations">
          <OperationsDashboard filters={filterState.queryParams} active={activeTab === 'operations'} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceDashboard filters={filterState.queryParams} active={activeTab === 'performance'} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
