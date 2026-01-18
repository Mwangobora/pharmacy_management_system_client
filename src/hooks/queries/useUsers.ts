import { useQuery } from '@tanstack/react-query'
import { UsersApi, type UsersListParams } from '@/api/UsersApi'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UsersListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsers(params?: UsersListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => UsersApi.list(params, signal),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => UsersApi.getById(id, signal),
    enabled: !!id,
  })
}
