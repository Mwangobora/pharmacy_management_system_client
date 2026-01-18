import { useQuery } from '@tanstack/react-query'
import { AuthApi } from '@/api/AuthApi'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: ({ signal }) => AuthApi.getCurrentUser(signal),
  })
}
