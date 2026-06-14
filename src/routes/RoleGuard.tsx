import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from './paths'

interface RoleGuardProps {
  requiredPermission?: string
  requiredPermissions?: string[]
  requireAllPermissions?: boolean
}

/**
 * Guard component for protecting routes based on roles or permissions
 * 
 * @param allowedRoles - Array of role names that can access the route
 * @param requiredPermission - Single permission required to access the route
 * @param requiredPermissions - Array of permissions (checks if user has ANY of them)
 * @param requireAllPermissions - If true, user must have ALL permissions in requiredPermissions
 */
export function RoleGuard({
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = false,
}: RoleGuardProps) {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore()

  if (!user?.is_active) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)

    if (!hasAccess) {
      return <Navigate to={ROUTES.ACCESS_DENIED} replace />
    }
  }

  return <Outlet />
}
