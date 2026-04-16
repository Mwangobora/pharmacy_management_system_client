import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { ROUTES } from './paths'
import { LoadingScreen } from '@/components/LoadingScreen'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const RolesPage = lazy(() => import('@/pages/RolesPage'))
const PermissionsPage = lazy(() => import('@/pages/PermissionsPage'))
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'))
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const MedicinesPage = lazy(() => import('@/pages/MedicinesPage'))
const StockTransactionsPage = lazy(() => import('@/pages/StockTransactionsPage'))
const InventoryManagementPage = lazy(() => import('@/pages/InventoryManagementPage'))
const SuppliersPage = lazy(() => import('@/pages/SuppliersPage'))
const PurchasesPage = lazy(() => import('@/pages/PurchasesPage'))
const PurchaseDetailPage = lazy(() => import('@/pages/PurchaseDetailPage'))
const ProcurementPage = lazy(() => import('@/pages/ProcurementPage'))
const CustomersPage = lazy(() => import('@/pages/CustomersPage'))
const SalesPage = lazy(() => import('@/pages/SalesPage'))
const SaleDetailPage = lazy(() => import('@/pages/SaleDetailPage'))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'))
const SalesBillingPage = lazy(() => import('@/pages/SalesBillingPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AccessDeniedPage = lazy(() => import('@/pages/AccessDeniedPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
            <Route index element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route
              path="user-management"
              element={
                <RoleGuard requiredPermissions={['view_user', 'add_user', 'change_user', 'delete_user', 'view_role', 'view_permission']} />
              }
            >
              <Route element={<UserManagementPage />}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="permissions" element={<PermissionsPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
              </Route>
            </Route>

            <Route
              path="inventory"
              element={<RoleGuard requiredPermissions={['view_category', 'view_medicine', 'view_stocktransaction']} />}
            >
              <Route element={<InventoryManagementPage />}>
                <Route index element={<Navigate to="categories" replace />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="medicines" element={<MedicinesPage />} />
                <Route path="stock-transactions" element={<StockTransactionsPage />} />
              </Route>
            </Route>

            <Route
              path="procurement"
              element={<RoleGuard requiredPermissions={['view_supplier', 'view_purchase']} />}
            >
              <Route element={<ProcurementPage />}>
                <Route index element={<Navigate to="suppliers" replace />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="purchases" element={<PurchasesPage />} />
              </Route>
              <Route path="purchases/:id" element={<PurchaseDetailPage />} />
            </Route>

            <Route
              path="sales-billing"
              element={<RoleGuard requiredPermissions={['view_customer', 'view_sale', 'view_payment']} />}
            >
              <Route element={<SalesBillingPage />}>
                <Route index element={<Navigate to="customers" replace />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="sales" element={<SalesPage />} />
                <Route path="payments" element={<PaymentsPage />} />
              </Route>
              <Route path="sales/:id" element={<SaleDetailPage />} />
            </Route>

            {/* Legacy redirects for direct links */}
            <Route path="users" element={<Navigate to={ROUTES.USERS} replace />} />
            <Route path="roles" element={<Navigate to={ROUTES.ROLES} replace />} />
            <Route path="permissions" element={<Navigate to={ROUTES.PERMISSIONS} replace />} />
            <Route path="categories" element={<Navigate to={ROUTES.CATEGORIES} replace />} />
            <Route path="medicines" element={<Navigate to={ROUTES.MEDICINES} replace />} />
            <Route path="stock-transactions" element={<Navigate to={ROUTES.STOCK_TRANSACTIONS} replace />} />
            <Route path="suppliers" element={<Navigate to={ROUTES.SUPPLIERS} replace />} />
            <Route path="purchases" element={<Navigate to={ROUTES.PURCHASES} replace />} />
            <Route path="purchases/:id" element={<Navigate to={ROUTES.PURCHASES} replace />} />
            <Route path="customers" element={<Navigate to={ROUTES.CUSTOMERS} replace />} />
            <Route path="sales" element={<Navigate to={ROUTES.SALES} replace />} />
            <Route path="sales/:id" element={<Navigate to={ROUTES.SALES} replace />} />
            <Route path="payments" element={<Navigate to={ROUTES.PAYMENTS} replace />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
