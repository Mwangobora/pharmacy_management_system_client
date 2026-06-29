export type DashboardPreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom'

export interface DashboardQueryParams {
  preset: DashboardPreset
  date_from?: string
  date_to?: string
  cashier_id?: string
  payment_method?: string
}

export interface DashboardPeriod {
  preset: DashboardPreset
  date_from: string
  date_to: string
  comparison_date_from?: string
  comparison_date_to?: string
  label: string
  currency?: string
  updated_at?: string
}

export interface DashboardMetric {
  key: string
  label: string
  value: number | null
  previous_value?: number | null
  absolute_change?: number | null
  percentage_change?: number | null
  comparison_available?: boolean
  restricted?: boolean
}

export interface DashboardOption {
  value: string
  label: string
}

export interface DashboardFilterOptions {
  payment_methods: DashboardOption[]
  cashiers: DashboardOption[]
  advanced_filters_available: string[]
}

export interface TrendPoint {
  label: string
  revenue?: number | null
  gross_profit?: number | null
  sales?: number | null
  quantity_sold?: number | null
  average_sale?: number | null
  discount_value?: number | null
  cogs?: number | null
  refund_value?: number | null
}

export interface DashboardAlert {
  key: string
  label: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  count: number
  href: string
}

export interface DashboardRecentSale {
  id: string
  invoice_number: string
  sale_date: string
  customer_name: string
  cashier: string
  items_count: number
  payment_method: string
  total: number
  status: string
}

export interface DashboardRankedMedicine {
  medicine_id?: string
  name?: string
  generic_name?: string | null
  quantity_sold?: number
  revenue?: number
  gross_profit?: number | null
}

export interface DashboardOverviewResponse {
  period: DashboardPeriod
  summary: DashboardMetric[]
  trend: {
    granularity: string
    series: TrendPoint[]
  }
  profit_summary: {
    revenue: number
    estimated_gross_profit: number | null
    refund_estimate: number
    outstanding_balance: number
    expense_data_available: boolean
  }
  alerts: DashboardAlert[]
  top_selling: DashboardRankedMedicine[]
  recent_sales: DashboardRecentSale[]
  payment_breakdown: Array<{
    payment_method: string
    revenue: number
    transactions: number
  }>
}

export interface DashboardSalesResponse {
  summary: DashboardMetric[]
  trend: TrendPoint[]
  sales_by_time: {
    by_hour: Array<{ hour: number | null; sales: number; revenue: number }>
    by_weekday: Array<{ weekday: number | null; sales: number; revenue: number }>
  }
  top_by_quantity: DashboardRankedMedicine[]
  top_by_revenue: DashboardRankedMedicine[]
  top_by_profit: DashboardRankedMedicine[]
  slow_moving: Array<{
    medicine_id: string
    name: string
    generic_name: string | null
    stock_quantity: number
    stock_value: number
  }>
  by_category: Array<{
    category: string
    revenue: number
    quantity_sold: number
  }>
  payment_methods: Array<{
    payment_method: string
    transactions: number
    revenue: number
  }>
  profit_visible: boolean
  refund_events: number
}

export interface DashboardInventoryResponse {
  summary: DashboardMetric[]
  stock_status: Record<string, number>
  low_stock: Array<{
    id: string
    medicine: string
    current_stock: number
    reorder_level: number
    shortage_quantity: number
    supplier: string
    last_purchase_date: string | null
  }>
  expiry_monitoring: Record<
    string,
    Array<{
      id: string
      medicine: string
      batch_number: string
      days_to_expiry: number
    }>
  >
  stock_movements: Array<{
    label: string
    transaction_type: string
    quantity: number
  }>
  slow_moving: Array<{
    id: string
    medicine: string
    stock_quantity: number
    stock_value: number
    expiry_date: string
  }>
  turnover: number | null
}

export interface DashboardFinanceResponse {
  summary: DashboardMetric[]
  trend: TrendPoint[]
  cash_flow: {
    inflows: Array<{ payment_method: string; amount: number }>
    outflows: Array<{ label: string; amount: number }>
  }
  expense_data_available: boolean
  profit_visible: boolean
  profitability: Array<unknown>
}

export interface DashboardOperationsResponse {
  summary: DashboardMetric[]
  pending_actions: Array<{
    type: string
    reference: string
    created_at: string
    assigned_user: string
    priority: string
    status: string
    href: string
  }>
  procurement_snapshot: {
    open_purchase_balances: number
    recently_received_stock: number
  }
  exceptions: Array<{
    label: string
    count: number
    status: string
  }>
}

export interface DashboardPerformanceResponse {
  staff_visible: boolean
  cashier_performance: Array<{
    staff_id: string
    name: string
    revenue: number
    sales_count: number
    average_sale: number
  }>
  category_performance: Array<{
    category: string
    revenue: number
    quantity_sold: number
    gross_profit: number | null
  }>
  growth_indicators: {
    identified_customers: number
    repeat_customer_rate: number | null
    average_basket_value: number
    sales_volume: number
  }
}
