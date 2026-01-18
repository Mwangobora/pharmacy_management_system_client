import { useQuery } from '@tanstack/react-query'
import { PurchasesApi, type PurchaseListParams } from '@/api/SuppliersApi'

export const purchaseKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchaseKeys.all, 'list'] as const,
  list: (params?: PurchaseListParams) => [...purchaseKeys.lists(), params] as const,
  details: () => [...purchaseKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseKeys.details(), id] as const,
}

export function usePurchases(params?: PurchaseListParams) {
  return useQuery({
    queryKey: purchaseKeys.list(params),
    queryFn: ({ signal }) => PurchasesApi.list(params, signal),
  })
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: purchaseKeys.detail(id),
    queryFn: ({ signal }) => PurchasesApi.getById(id, signal),
    enabled: !!id,
  })
}
