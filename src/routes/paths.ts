export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/dashboard/home',
  USERS: '/dashboard/users',
  ROLES: '/dashboard/roles',
  PERMISSIONS: '/dashboard/permissions',
  CATEGORIES: '/dashboard/categories',
  MEDICINES: '/dashboard/medicines',
  STOCK_TRANSACTIONS: '/dashboard/stock-transactions',
  SUPPLIERS: '/dashboard/suppliers',
  PURCHASES: '/dashboard/purchases',
  PURCHASE_DETAIL: '/dashboard/purchases/:id',
  CUSTOMERS: '/dashboard/customers',
  SALES: '/dashboard/sales',
  SALE_DETAIL: '/dashboard/sales/:id',
  PAYMENTS: '/dashboard/payments',
  PROFILE: '/dashboard/profile',
  NOT_FOUND: '*',
  ACCESS_DENIED: '/access-denied',
} as const

export const getPurchaseDetailPath = (id: string) => `/dashboard/purchases/${id}`
export const getSaleDetailPath = (id: string) => `/dashboard/sales/${id}`
