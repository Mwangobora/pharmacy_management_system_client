import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SalesApi } from '@/api/SalesApi'
import type { SaleCreatePayload } from '@/types/sales'
import { saleKeys } from '../queries/useSales'

export function useCreateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SaleCreatePayload) => SalesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() })
    },
  })
}

export function useUpdateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SaleCreatePayload> }) =>
      SalesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: saleKeys.detail(variables.id) })
    },
  })
}

export function useDeleteSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SalesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() })
    },
  })
}
