import { useQuery } from '@tanstack/react-query'
import { CategoriesApi, type ListParams } from '@/api/InventoryApi'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: ListParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

export function useCategories(params?: ListParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: ({ signal }) => CategoriesApi.list(params, signal),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: ({ signal }) => CategoriesApi.getById(id, signal),
    enabled: !!id,
  })
}
