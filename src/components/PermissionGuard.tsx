import { type ReactNode } from 'react'
import { usePermission, useAnyPermission, useAllPermissions } from '@/hooks/usePermissions'

interface PermissionGuardProps {
  children: ReactNode
  permission?: string
  anyPermissions?: string[]
  allPermissions?: string[]
  fallback?: ReactNode
}

/**
 * Component to conditionally render children based on user permissions
 * 
 * @example
 * // Render if user has 'manage_users' permission
 * <PermissionGuard permission="manage_users">
 *   <Button>Create User</Button>
 * </PermissionGuard>
 * 
 * @example
 * // Render if user has any of the specified permissions
 * <PermissionGuard anyPermissions={["view_sales", "manage_sales"]}>
 *   <SalesSection />
 * </PermissionGuard>
 * 
 * @example
 * // Render if user has all of the specified permissions
 * <PermissionGuard allPermissions={["view_reports", "export_data"]}>
 *   <ExportButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
}: PermissionGuardProps) {
  const hasSinglePermission = usePermission(permission || '')
  const hasAny = useAnyPermission(anyPermissions || [])
  const hasAll = useAllPermissions(allPermissions || [])

  // Check which type of permission check to perform
  let hasAccess = false

  if (permission) {
    hasAccess = hasSinglePermission
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll
  } else {
    // If no permissions specified, allow access
    hasAccess = true
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
