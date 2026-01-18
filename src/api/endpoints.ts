// API Endpoint Keys - actual paths are configured via VITE_API_BASE_URL
export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login/',
  AUTH_REGISTER: '/api/auth/register/',
  AUTH_REFRESH: '/api/auth/jwt/refresh/',
  AUTH_VERIFY: '/api/auth/jwt/verify/',
  AUTH_LOGOUT: '/api/auth/logout/',
  AUTH_ME: '/api/auth/users/me/',
  AUTH_SET_PASSWORD: '/api/auth/users/set_password/',

  // Users
  USERS: '/api/users/',
  USERS_AUTH_INFO: '/api/users/auth_info/',

  // Roles
  ROLES: '/api/auth/roles/',

  // Permissions
  PERMISSIONS: '/api/auth/permissions/',

  // Categories
  CATEGORIES: '/api/categories/',

  // Medicines
  MEDICINES: '/api/medicines/',
  MEDICINES_LOW_STOCK: '/api/medicines/low_stock/',
  MEDICINES_EXPIRING_SOON: '/api/medicines/expiring_soon/',
  MEDICINES_EXPIRED: '/api/medicines/expired/',
  MEDICINES_DASHBOARD_STATS: '/api/medicines/dashboard_stats/',

  // Stock Transactions
  STOCK_TRANSACTIONS: '/api/stock-transactions/',
  STOCK_TRANSACTIONS_SUMMARY: '/api/stock-transactions/summary/',

  // Suppliers
  SUPPLIERS: '/api/suppliers/',

  // Purchases
  PURCHASES: '/api/purchases/',
  PURCHASES_CREATE_WITH_ITEMS: '/api/purchases/create_with_items/',
  PURCHASES_PENDING_PAYMENTS: '/api/purchases/pending_payments/',
  PURCHASES_DASHBOARD_STATS: '/api/purchases/dashboard_stats/',

  // Purchase Items
  PURCHASE_ITEMS: '/api/purchase-items/',

  // Customers
  CUSTOMERS: '/api/customers/',

  // Sales
  SALES: '/api/sales/',
  SALES_CREATE_WITH_ITEMS: '/api/sales/create_with_items/',
  SALES_DAILY_SUMMARY: '/api/sales/daily_summary/',
  SALES_TOP_SELLING: '/api/sales/top_selling/',

  // Payments
  PAYMENTS: '/api/payments/',
} as const
