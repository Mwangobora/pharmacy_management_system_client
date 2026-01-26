import { useAuthStore } from '@/store/authStore'

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: string): boolean {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  return hasPermission(permission)
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissions: string[]): boolean {
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  return hasAnyPermission(permissions)
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useAllPermissions(permissions: string[]): boolean {
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions)
  return hasAllPermissions(permissions)
}

/**
 * Hook to get all user permissions
 */
export function usePermissions(): string[] {
  const permissions = useAuthStore((state) => state.permissions)
  return permissions
}
