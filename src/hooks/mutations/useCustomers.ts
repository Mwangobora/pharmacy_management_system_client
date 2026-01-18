import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CustomersApi } from '@/api/SalesApi'
import type { CustomerCreatePayload, CustomerUpdatePayload } from '@/types/sales'
import { customerKeys } from '../queries/useCustomers'

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CustomerCreatePayload) => CustomersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CustomerUpdatePayload }) =>
      CustomersApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CustomersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export function useAddLoyaltyPoints() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, points }: { id: string; points: number }) =>
      CustomersApi.addLoyaltyPoints(id, { points }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
    },
  })
}
