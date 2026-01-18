import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PurchasesApi } from '@/api/SuppliersApi'
import type { PurchaseCreatePayload, PurchaseUpdatePayload } from '@/types/suppliers'
import { purchaseKeys } from '../queries/usePurchases'

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PurchaseCreatePayload) => PurchasesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() })
    },
  })
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PurchaseUpdatePayload }) =>
      PurchasesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) })
    },
  })
}

export function useDeletePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => PurchasesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() })
    },
  })
}
