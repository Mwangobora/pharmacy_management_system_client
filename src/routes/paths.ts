export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/dashboard/home',

  USER_MANAGEMENT: '/dashboard/user-management',
  USERS: '/dashboard/user-management/users',
  ROLES: '/dashboard/user-management/roles',
  PERMISSIONS: '/dashboard/user-management/permissions',
  AUDIT_LOGS: '/dashboard/user-management/audit-logs',

  INVENTORY: '/dashboard/inventory',
  CATEGORIES: '/dashboard/inventory/categories',
  MEDICINES: '/dashboard/inventory/medicines',
  STOCK_TRANSACTIONS: '/dashboard/inventory/stock-transactions',

  PROCUREMENT: '/dashboard/procurement',
  SUPPLIERS: '/dashboard/procurement/suppliers',
  PURCHASES: '/dashboard/procurement/purchases',
  PURCHASE_DETAIL: '/dashboard/procurement/purchases/:id',

  SALES_BILLING: '/dashboard/sales-billing',
  CUSTOMERS: '/dashboard/sales-billing/customers',
  SALES: '/dashboard/sales-billing/sales',
  SALE_DETAIL: '/dashboard/sales-billing/sales/:id',
  PAYMENTS: '/dashboard/sales-billing/payments',

  PROFILE: '/dashboard/profile',
  NOT_FOUND: '*',
  ACCESS_DENIED: '/access-denied',
} as const

export const getPurchaseDetailPath = (id: string) => `/dashboard/procurement/purchases/${id}`
export const getSaleDetailPath = (id: string) => `/dashboard/sales-billing/sales/${id}`
