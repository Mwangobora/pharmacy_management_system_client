import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PurchasesApi } from '@/api/SuppliersApi'
import type {
  PurchaseCreatePayload,
  PurchaseUpdatePayload,
  ReceiveItemsPayload,
  UpdatePaymentStatusPayload,
} from '@/types/suppliers'
import { purchaseKeys } from '../queries/usePurchases'
import { medicineKeys } from '../queries/useMedicines'

// Receiving a purchase creates/updates batches and medicine stock, so any
// successful create/receive must also invalidate inventory caches -
// otherwise the Inventory pages and sidebar keep showing stale (e.g. 0) stock.
function invalidatePurchaseAndStockCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() })
  queryClient.invalidateQueries({ queryKey: medicineKeys.all })
}

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PurchaseCreatePayload) => PurchasesApi.create(payload),
    onSuccess: () => {
      invalidatePurchaseAndStockCaches(queryClient)
    },
  })
}

export function useReceiveItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReceiveItemsPayload }) =>
      PurchasesApi.receiveItems(id, payload),
    onSuccess: (_, variables) => {
      invalidatePurchaseAndStockCaches(queryClient)
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) })
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

export function useUpdatePurchasePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentStatusPayload }) =>
      PurchasesApi.updatePaymentStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) })
    },
  })
}
