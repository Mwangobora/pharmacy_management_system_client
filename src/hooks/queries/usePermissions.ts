import { useQuery } from '@tanstack/react-query'
import { PermissionsApi } from '@/api/PermissionsApi'

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: () => [...permissionKeys.lists()] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
}

export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: ({ signal }) => PermissionsApi.list(signal),
  })
}

export function usePermission(id: number) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: ({ signal }) => PermissionsApi.getById(id, signal),
    enabled: !!id,
  })
}
