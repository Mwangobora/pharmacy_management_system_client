import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SuppliersApi } from '@/api/SuppliersApi'
import type { SupplierCreatePayload, SupplierUpdatePayload } from '@/types/suppliers'
import { supplierKeys } from '../queries/useSuppliers'

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SupplierCreatePayload) => SuppliersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierUpdatePayload }) =>
      SuppliersApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SuppliersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
    },
  })
}
