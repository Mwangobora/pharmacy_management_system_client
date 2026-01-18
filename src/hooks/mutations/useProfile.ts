import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthApi } from '@/api/AuthApi'
import type { ChangePasswordPayload, UpdateProfilePayload } from '@/types/auth'
import { profileKeys } from '../queries/useProfile'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => AuthApi.updateCurrentUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => AuthApi.changePassword(payload),
  })
}
