import type {
  Customer,
  CustomerCreatePayload,
  CustomerUpdatePayload,
  Sale,
  SaleCreatePayload,
  ProcessPaymentPayload,
  RefundPayload,
  AddLoyaltyPointsPayload,
  Payment,
  DailySummary,
  TopSellingMedicine,
} from '@/types/sales'
import { httpClient, unwrapList } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface CustomerListParams {
  gender?: string
  search?: string
  ordering?: string
}

export interface SaleListParams {
  customer?: string
  payment_method?: string
  payment_status?: string
  served_by?: string
  start_date?: string
  end_date?: string
  search?: string
  ordering?: string
}

export interface PaymentListParams {
  sale?: string
  payment_method?: string
  received_by?: string
  ordering?: string
}

export class CustomersApi {
  static async list(params?: CustomerListParams, signal?: AbortSignal): Promise<Customer[]> {
    const data = await httpClient.get<Customer[] | { results?: Customer[] }>(
      ENDPOINTS.CUSTOMERS,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Customer> {
    return httpClient.get<Customer>(`${ENDPOINTS.CUSTOMERS}${id}/`, undefined, signal)
  }

  static async create(payload: CustomerCreatePayload): Promise<Customer> {
    return httpClient.post<Customer>(ENDPOINTS.CUSTOMERS, payload)
  }

  static async update(id: string, payload: CustomerUpdatePayload): Promise<Customer> {
    return httpClient.patch<Customer>(`${ENDPOINTS.CUSTOMERS}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.CUSTOMERS}${id}/`)
  }

  static async getPurchaseHistory(id: string, signal?: AbortSignal): Promise<Sale[]> {
    const data = await httpClient.get<Sale[] | { results?: Sale[] }>(
      `${ENDPOINTS.CUSTOMERS}${id}/purchase_history/`,
      undefined,
      signal
    )
    return unwrapList(data)
  }

  static async getLoyaltySummary(id: string, signal?: AbortSignal) {
    return httpClient.get(`${ENDPOINTS.CUSTOMERS}${id}/loyalty_summary/`, undefined, signal)
  }

  static async addLoyaltyPoints(id: string, payload: AddLoyaltyPointsPayload): Promise<Customer> {
    return httpClient.post<Customer>(`${ENDPOINTS.CUSTOMERS}${id}/add_loyalty_points/`, payload)
  }
}

export class SalesApi {
  static async list(params?: SaleListParams, signal?: AbortSignal): Promise<Sale[]> {
    const data = await httpClient.get<Sale[] | { results?: Sale[] }>(
      ENDPOINTS.SALES,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Sale> {
    return httpClient.get<Sale>(`${ENDPOINTS.SALES}${id}/`, undefined, signal)
  }

  static async create(payload: SaleCreatePayload): Promise<Sale> {
    return httpClient.post<Sale>(ENDPOINTS.SALES_CREATE_WITH_ITEMS, payload)
  }

  static async update(id: string, payload: Partial<SaleCreatePayload>): Promise<Sale> {
    return httpClient.patch<Sale>(`${ENDPOINTS.SALES}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.SALES}${id}/`)
  }

  static async processPayment(id: string, payload: ProcessPaymentPayload): Promise<Sale> {
    return httpClient.post<Sale>(`${ENDPOINTS.SALES}${id}/process_payment/`, payload)
  }

  static async refund(id: string, payload: RefundPayload): Promise<Sale> {
    return httpClient.post<Sale>(`${ENDPOINTS.SALES}${id}/refund/`, payload)
  }

  static async getDailySummary(date?: string, signal?: AbortSignal): Promise<DailySummary> {
    const params = date ? { date } : {}
    return httpClient.get<DailySummary>(ENDPOINTS.SALES_DAILY_SUMMARY, params, signal)
  }

  static async getTopSelling(days = 30, limit = 10, signal?: AbortSignal): Promise<TopSellingMedicine[]> {
    return httpClient.get<TopSellingMedicine[]>(
      ENDPOINTS.SALES_TOP_SELLING,
      { days: days.toString(), limit: limit.toString() },
      signal
    )
  }
}

export class PaymentsApi {
  static async list(params?: PaymentListParams, signal?: AbortSignal): Promise<Payment[]> {
    const data = await httpClient.get<Payment[] | { results?: Payment[] }>(
      ENDPOINTS.PAYMENTS,
      params as Record<string, string>,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<Payment> {
    return httpClient.get<Payment>(`${ENDPOINTS.PAYMENTS}${id}/`, undefined, signal)
  }
}
