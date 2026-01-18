import type {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  Medicine,
  MedicineCreatePayload,
  MedicineUpdatePayload,
  StockAdjustment,
  StockTransaction,
  DashboardStats,
} from '@/types/inventory'
import { httpClient, unwrapList } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface ListParams {
  search?: string
  ordering?: string
  is_active?: string
  page?: string
}

export interface MedicineListParams extends ListParams {
  category?: string
  supplier?: string
  requires_prescription?: string
  stock_status?: string
  expiry_status?: string
}

export interface StockTransactionParams {
  medicine?: string
  transaction_type?: string
  created_by?: string
  start_date?: string
  end_date?: string
}

export class CategoriesApi {
  static async list(params?: ListParams, signal?: AbortSignal): Promise<Category[]> {
    const data = await httpClient.get<Category[] | { results?: Category[] }>(
      ENDPOINTS.CATEGORIES,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Category> {
    return httpClient.get<Category>(`${ENDPOINTS.CATEGORIES}${id}/`, undefined, signal)
  }

  static async create(payload: CategoryCreatePayload): Promise<Category> {
    return httpClient.post<Category>(ENDPOINTS.CATEGORIES, payload)
  }

  static async update(id: string, payload: CategoryUpdatePayload): Promise<Category> {
    return httpClient.patch<Category>(`${ENDPOINTS.CATEGORIES}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.CATEGORIES}${id}/`)
  }

  static async getMedicines(id: string, signal?: AbortSignal): Promise<Medicine[]> {
    const data = await httpClient.get<Medicine[] | { results?: Medicine[] }>(
      `${ENDPOINTS.CATEGORIES}${id}/medicines/`,
      undefined,
      signal
    )
    return unwrapList(data)
  }
}

export class MedicinesApi {
  static async list(params?: MedicineListParams, signal?: AbortSignal): Promise<Medicine[]> {
    const data = await httpClient.get<Medicine[] | { results?: Medicine[] }>(
      ENDPOINTS.MEDICINES,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Medicine> {
    return httpClient.get<Medicine>(`${ENDPOINTS.MEDICINES}${id}/`, undefined, signal)
  }

  static async create(payload: MedicineCreatePayload): Promise<Medicine> {
    return httpClient.post<Medicine>(ENDPOINTS.MEDICINES, payload)
  }

  static async update(id: string, payload: MedicineUpdatePayload): Promise<Medicine> {
    return httpClient.patch<Medicine>(`${ENDPOINTS.MEDICINES}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.MEDICINES}${id}/`)
  }

  static async getLowStock(signal?: AbortSignal): Promise<Medicine[]> {
    const data = await httpClient.get<Medicine[] | { results?: Medicine[] }>(
      ENDPOINTS.MEDICINES_LOW_STOCK,
      undefined,
      signal
    )
    return unwrapList(data)
  }

  static async getExpiringSoon(days = 30, signal?: AbortSignal): Promise<Medicine[]> {
    const data = await httpClient.get<Medicine[] | { results?: Medicine[] }>(
      ENDPOINTS.MEDICINES_EXPIRING_SOON,
      { days: days.toString() },
      signal
    )
    return unwrapList(data)
  }

  static async getExpired(signal?: AbortSignal): Promise<Medicine[]> {
    const data = await httpClient.get<Medicine[] | { results?: Medicine[] }>(
      ENDPOINTS.MEDICINES_EXPIRED,
      undefined,
      signal
    )
    return unwrapList(data)
  }

  static async adjustStock(id: string, payload: StockAdjustment): Promise<Medicine> {
    return httpClient.post<Medicine>(`${ENDPOINTS.MEDICINES}${id}/adjust_stock/`, payload)
  }

  static async getDashboardStats(signal?: AbortSignal): Promise<DashboardStats> {
    return httpClient.get<DashboardStats>(ENDPOINTS.MEDICINES_DASHBOARD_STATS, undefined, signal)
  }
}

export class StockTransactionsApi {
  static async list(params?: StockTransactionParams, signal?: AbortSignal): Promise<StockTransaction[]> {
    const data = await httpClient.get<StockTransaction[] | { results?: StockTransaction[] }>(
      ENDPOINTS.STOCK_TRANSACTIONS,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<StockTransaction> {
    return httpClient.get<StockTransaction>(`${ENDPOINTS.STOCK_TRANSACTIONS}${id}/`, undefined, signal)
  }

  static async getSummary(startDate?: string, endDate?: string, signal?: AbortSignal) {
    const params: Record<string, string> = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    return httpClient.get(ENDPOINTS.STOCK_TRANSACTIONS_SUMMARY, params, signal)
  }
}
