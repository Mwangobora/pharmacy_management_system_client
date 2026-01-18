import type {
  Supplier,
  SupplierCreatePayload,
  SupplierUpdatePayload,
  Purchase,
  PurchaseCreatePayload,
  PurchaseUpdatePayload,
  ReceiveItemsPayload,
  UpdatePaymentStatusPayload,
  PurchaseItem,
} from '@/types/suppliers'
import type { Medicine } from '@/types/inventory'
import { httpClient } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface SupplierListParams {
  search?: string
  ordering?: string
  is_active?: string
}

export interface PurchaseListParams {
  supplier?: string
  payment_status?: string
  start_date?: string
  end_date?: string
  search?: string
  ordering?: string
}

export class SuppliersApi {
  static async list(params?: SupplierListParams, signal?: AbortSignal): Promise<Supplier[]> {
    return httpClient.get<Supplier[]>(ENDPOINTS.SUPPLIERS, params as Record<string, string>, signal)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Supplier> {
    return httpClient.get<Supplier>(`${ENDPOINTS.SUPPLIERS}${id}/`, undefined, signal)
  }

  static async create(payload: SupplierCreatePayload): Promise<Supplier> {
    return httpClient.post<Supplier>(ENDPOINTS.SUPPLIERS, payload)
  }

  static async update(id: string, payload: SupplierUpdatePayload): Promise<Supplier> {
    return httpClient.patch<Supplier>(`${ENDPOINTS.SUPPLIERS}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.SUPPLIERS}${id}/`)
  }

  static async getPurchases(id: string, signal?: AbortSignal): Promise<Purchase[]> {
    return httpClient.get<Purchase[]>(`${ENDPOINTS.SUPPLIERS}${id}/purchases/`, undefined, signal)
  }

  static async getMedicines(id: string, signal?: AbortSignal): Promise<Medicine[]> {
    return httpClient.get<Medicine[]>(`${ENDPOINTS.SUPPLIERS}${id}/medicines/`, undefined, signal)
  }

  static async getStatistics(id: string, signal?: AbortSignal) {
    return httpClient.get(`${ENDPOINTS.SUPPLIERS}${id}/statistics/`, undefined, signal)
  }
}

export class PurchasesApi {
  static async list(params?: PurchaseListParams, signal?: AbortSignal): Promise<Purchase[]> {
    return httpClient.get<Purchase[]>(ENDPOINTS.PURCHASES, params as Record<string, string>, signal)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Purchase> {
    return httpClient.get<Purchase>(`${ENDPOINTS.PURCHASES}${id}/`, undefined, signal)
  }

  static async create(payload: PurchaseCreatePayload): Promise<Purchase> {
    return httpClient.post<Purchase>(ENDPOINTS.PURCHASES_CREATE_WITH_ITEMS, payload)
  }

  static async update(id: string, payload: PurchaseUpdatePayload): Promise<Purchase> {
    return httpClient.patch<Purchase>(`${ENDPOINTS.PURCHASES}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.PURCHASES}${id}/`)
  }

  static async receiveItems(id: string, payload: ReceiveItemsPayload): Promise<Purchase> {
    return httpClient.post<Purchase>(`${ENDPOINTS.PURCHASES}${id}/receive_items/`, payload)
  }

  static async updatePaymentStatus(id: string, payload: UpdatePaymentStatusPayload): Promise<Purchase> {
    return httpClient.patch<Purchase>(`${ENDPOINTS.PURCHASES}${id}/update_payment_status/`, payload)
  }

  static async getPendingPayments(signal?: AbortSignal): Promise<Purchase[]> {
    return httpClient.get<Purchase[]>(ENDPOINTS.PURCHASES_PENDING_PAYMENTS, undefined, signal)
  }

  static async getDashboardStats(signal?: AbortSignal) {
    return httpClient.get(ENDPOINTS.PURCHASES_DASHBOARD_STATS, undefined, signal)
  }
}

export class PurchaseItemsApi {
  static async list(params?: { purchase?: string; medicine?: string }, signal?: AbortSignal): Promise<PurchaseItem[]> {
    return httpClient.get<PurchaseItem[]>(ENDPOINTS.PURCHASE_ITEMS, params as Record<string, string>, signal)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<PurchaseItem> {
    return httpClient.get<PurchaseItem>(`${ENDPOINTS.PURCHASE_ITEMS}${id}/`, undefined, signal)
  }
}
