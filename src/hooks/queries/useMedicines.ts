import { useQuery } from '@tanstack/react-query'
import { MedicinesApi, type MedicineListParams } from '@/api/InventoryApi'

export const medicineKeys = {
  all: ['medicines'] as const,
  lists: () => [...medicineKeys.all, 'list'] as const,
  list: (params?: MedicineListParams) => [...medicineKeys.lists(), params] as const,
  details: () => [...medicineKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicineKeys.details(), id] as const,
  lowStock: () => [...medicineKeys.all, 'lowStock'] as const,
  expiringSoon: (days?: number) => [...medicineKeys.all, 'expiringSoon', days] as const,
  expired: () => [...medicineKeys.all, 'expired'] as const,
  dashboardStats: () => [...medicineKeys.all, 'dashboardStats'] as const,
}

export function useMedicines(params?: MedicineListParams) {
  return useQuery({
    queryKey: medicineKeys.list(params),
    queryFn: ({ signal }) => MedicinesApi.list(params, signal),
  })
}

export function useMedicine(id: string) {
  return useQuery({
    queryKey: medicineKeys.detail(id),
    queryFn: ({ signal }) => MedicinesApi.getById(id, signal),
    enabled: !!id,
  })
}

export function useLowStockMedicines() {
  return useQuery({
    queryKey: medicineKeys.lowStock(),
    queryFn: ({ signal }) => MedicinesApi.getLowStock(signal),
  })
}

export function useExpiringSoonMedicines(days = 30) {
  return useQuery({
    queryKey: medicineKeys.expiringSoon(days),
    queryFn: ({ signal }) => MedicinesApi.getExpiringSoon(days, signal),
  })
}

export function useExpiredMedicines() {
  return useQuery({
    queryKey: medicineKeys.expired(),
    queryFn: ({ signal }) => MedicinesApi.getExpired(signal),
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: medicineKeys.dashboardStats(),
    queryFn: ({ signal }) => MedicinesApi.getDashboardStats(signal),
  })
}
