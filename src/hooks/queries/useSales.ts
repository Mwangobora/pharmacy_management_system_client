import { useQuery } from '@tanstack/react-query'
import { SalesApi, type SaleListParams } from '@/api/SalesApi'

export const saleKeys = {
  all: ['sales'] as const,
  lists: () => [...saleKeys.all, 'list'] as const,
  list: (params?: SaleListParams) => [...saleKeys.lists(), params] as const,
  details: () => [...saleKeys.all, 'detail'] as const,
  detail: (id: string) => [...saleKeys.details(), id] as const,
}

export function useSales(params?: SaleListParams) {
  return useQuery({
    queryKey: saleKeys.list(params),
    queryFn: ({ signal }) => SalesApi.list(params, signal),
  })
}

export function useSale(id: string) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: ({ signal }) => SalesApi.getById(id, signal),
    enabled: !!id,
  })
}
