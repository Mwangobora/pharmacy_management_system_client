import { useQuery } from '@tanstack/react-query'
import { RolesApi } from '@/api/RolesApi'

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: () => [...roleKeys.lists()] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
}

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: ({ signal }) => RolesApi.list(signal),
  })
}

export function useRole(id: number) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: ({ signal }) => RolesApi.getById(id, signal),
    enabled: !!id,
  })
}
