import { httpClient } from './HttpClient'
import { ENDPOINTS } from './endpoints'
import type {
  DashboardFilterOptions,
  DashboardFinanceResponse,
  DashboardInventoryResponse,
  DashboardOperationsResponse,
  DashboardOverviewResponse,
  DashboardPerformanceResponse,
  DashboardQueryParams,
  DashboardSalesResponse,
} from '@/types/dashboard'

function toParams(filters: DashboardQueryParams): Record<string, string> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
  ) as Record<string, string>
}

export class DashboardApi {
  static async getFilters(signal?: AbortSignal): Promise<DashboardFilterOptions> {
    return httpClient.get<DashboardFilterOptions>(ENDPOINTS.DASHBOARD_FILTERS, undefined, signal)
  }

  static async getOverview(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardOverviewResponse> {
    return httpClient.get<DashboardOverviewResponse>(ENDPOINTS.DASHBOARD_OVERVIEW, toParams(filters), signal)
  }

  static async getSales(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardSalesResponse> {
    return httpClient.get<DashboardSalesResponse>(ENDPOINTS.DASHBOARD_SALES, toParams(filters), signal)
  }

  static async getInventory(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardInventoryResponse> {
    return httpClient.get<DashboardInventoryResponse>(ENDPOINTS.DASHBOARD_INVENTORY, toParams(filters), signal)
  }

  static async getFinance(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardFinanceResponse> {
    return httpClient.get<DashboardFinanceResponse>(ENDPOINTS.DASHBOARD_FINANCE, toParams(filters), signal)
  }

  static async getOperations(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardOperationsResponse> {
    return httpClient.get<DashboardOperationsResponse>(ENDPOINTS.DASHBOARD_OPERATIONS, toParams(filters), signal)
  }

  static async getPerformance(filters: DashboardQueryParams, signal?: AbortSignal): Promise<DashboardPerformanceResponse> {
    return httpClient.get<DashboardPerformanceResponse>(ENDPOINTS.DASHBOARD_PERFORMANCE, toParams(filters), signal)
  }
}
