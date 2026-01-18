import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from './paths'

interface RoleGuardProps {
  allowedRoles: string[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore()

  if (!user?.role_name || !allowedRoles.includes(user.role_name)) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />
  }

  return <Outlet />
}
