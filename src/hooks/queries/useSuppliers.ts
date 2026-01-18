import { useQuery } from '@tanstack/react-query'
import { SuppliersApi, type SupplierListParams } from '@/api/SuppliersApi'

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params?: SupplierListParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
}

export function useSuppliers(params?: SupplierListParams) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: ({ signal }) => SuppliersApi.list(params, signal),
  })
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: ({ signal }) => SuppliersApi.getById(id, signal),
    enabled: !!id,
  })
}
