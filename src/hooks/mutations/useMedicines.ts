import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MedicinesApi } from '@/api/InventoryApi'
import type { MedicineCreatePayload, MedicineUpdatePayload, StockAdjustment } from '@/types/inventory'
import { medicineKeys } from '../queries/useMedicines'

export function useCreateMedicine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MedicineCreatePayload) => MedicinesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() })
    },
  })
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MedicineUpdatePayload }) =>
      MedicinesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() })
      queryClient.invalidateQueries({ queryKey: medicineKeys.detail(variables.id) })
    },
  })
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => MedicinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() })
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StockAdjustment }) =>
      MedicinesApi.adjustStock(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() })
      queryClient.invalidateQueries({ queryKey: medicineKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: medicineKeys.lowStock() })
      queryClient.invalidateQueries({ queryKey: medicineKeys.dashboardStats() })
    },
  })
}
