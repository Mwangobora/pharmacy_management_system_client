import { useMemo, useState } from 'react'
import type { DashboardPreset, DashboardQueryParams } from '@/types/dashboard'

const defaultPreset: DashboardPreset = 'last_7_days'

export function useDashboardFilters() {
  const [preset, setPreset] = useState<DashboardPreset>(defaultPreset)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [cashierId, setCashierId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const queryParams = useMemo<DashboardQueryParams>(() => ({
    preset,
    date_from: preset === 'custom' ? dateFrom : undefined,
    date_to: preset === 'custom' ? dateTo : undefined,
    cashier_id: cashierId || undefined,
    payment_method: paymentMethod || undefined,
  }), [cashierId, dateFrom, dateTo, paymentMethod, preset])

  return {
    preset,
    setPreset,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    cashierId,
    setCashierId,
    paymentMethod,
    setPaymentMethod,
    queryParams,
  }
}
