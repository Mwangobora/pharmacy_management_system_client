import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from './paths'
import { LoadingScreen } from '@/components/LoadingScreen'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const RolesPage = lazy(() => import('@/pages/RolesPage'))
const PermissionsPage = lazy(() => import('@/pages/PermissionsPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const MedicinesPage = lazy(() => import('@/pages/MedicinesPage'))
const StockTransactionsPage = lazy(() => import('@/pages/StockTransactionsPage'))
const SuppliersPage = lazy(() => import('@/pages/SuppliersPage'))
const PurchasesPage = lazy(() => import('@/pages/PurchasesPage'))
const PurchaseDetailPage = lazy(() => import('@/pages/PurchaseDetailPage'))
const CustomersPage = lazy(() => import('@/pages/CustomersPage'))
const SalesPage = lazy(() => import('@/pages/SalesPage'))
const SaleDetailPage = lazy(() => import('@/pages/SaleDetailPage'))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'))
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
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="medicines" element={<MedicinesPage />} />
            <Route path="stock-transactions" element={<StockTransactionsPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="purchases/:id" element={<PurchaseDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="sales/:id" element={<SaleDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
