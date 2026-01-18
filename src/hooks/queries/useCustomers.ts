import { useQuery } from '@tanstack/react-query'
import { CustomersApi, type CustomerListParams } from '@/api/SalesApi'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerListParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
}

export function useCustomers(params?: CustomerListParams) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: ({ signal }) => CustomersApi.list(params, signal),
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: ({ signal }) => CustomersApi.getById(id, signal),
    enabled: !!id,
  })
}

export function useCustomerPurchaseHistory(id: string) {
  return useQuery({
    queryKey: [...customerKeys.detail(id), 'purchase-history'],
    queryFn: ({ signal }) => CustomersApi.getPurchaseHistory(id, signal),
    enabled: !!id,
  })
}

export function useCustomerLoyaltySummary(id: string) {
  return useQuery({
    queryKey: [...customerKeys.detail(id), 'loyalty-summary'],
    queryFn: ({ signal }) => CustomersApi.getLoyaltySummary(id, signal),
    enabled: !!id,
  })
}
