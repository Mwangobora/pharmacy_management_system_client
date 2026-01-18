import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PermissionsApi, type PermissionCreatePayload, type PermissionUpdatePayload } from '@/api/PermissionsApi'
import { permissionKeys } from '../queries/usePermissions'

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PermissionCreatePayload) => PermissionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}

export function useUpdatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PermissionUpdatePayload }) =>
      PermissionsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: permissionKeys.detail(variables.id) })
    },
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => PermissionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}
