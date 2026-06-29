import { useQuery } from '@tanstack/react-query'
import { DashboardApi } from '@/api/DashboardApi'
import type { DashboardQueryParams } from '@/types/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  filters: () => [...dashboardKeys.all, 'filters'] as const,
  overview: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'overview', filters] as const,
  sales: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'sales', filters] as const,
  inventory: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'inventory', filters] as const,
  finance: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'finance', filters] as const,
  operations: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'operations', filters] as const,
  performance: (filters: DashboardQueryParams) => [...dashboardKeys.all, 'performance', filters] as const,
}

const staleTime = 60_000

export function useDashboardFiltersOptions() {
  return useQuery({
    queryKey: dashboardKeys.filters(),
    queryFn: ({ signal }) => DashboardApi.getFilters(signal),
    staleTime,
  })
}

export function useDashboardOverview(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: ({ signal }) => DashboardApi.getOverview(filters, signal),
    staleTime,
    enabled,
  })
}

export function useDashboardSales(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.sales(filters),
    queryFn: ({ signal }) => DashboardApi.getSales(filters, signal),
    staleTime,
    enabled,
  })
}

export function useDashboardInventory(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.inventory(filters),
    queryFn: ({ signal }) => DashboardApi.getInventory(filters, signal),
    staleTime,
    enabled,
  })
}

export function useDashboardFinance(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.finance(filters),
    queryFn: ({ signal }) => DashboardApi.getFinance(filters, signal),
    staleTime,
    enabled,
  })
}

export function useDashboardOperations(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.operations(filters),
    queryFn: ({ signal }) => DashboardApi.getOperations(filters, signal),
    staleTime,
    enabled,
  })
}

export function useDashboardPerformance(filters: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.performance(filters),
    queryFn: ({ signal }) => DashboardApi.getPerformance(filters, signal),
    staleTime,
    enabled,
  })
}
