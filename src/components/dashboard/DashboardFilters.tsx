import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DashboardFilterOptions, DashboardPreset } from '@/types/dashboard'

const presets: Array<{ value: DashboardPreset; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'this_quarter', label: 'This quarter' },
  { value: 'this_year', label: 'This year' },
  { value: 'custom', label: 'Custom range' },
]

interface DashboardFiltersProps {
  preset: DashboardPreset
  dateFrom: string
  dateTo: string
  cashierId: string
  paymentMethod: string
  options?: DashboardFilterOptions
  onPresetChange: (value: DashboardPreset) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onCashierChange: (value: string) => void
  onPaymentMethodChange: (value: string) => void
}

export function DashboardFilters(props: DashboardFiltersProps) {
  const {
    preset,
    dateFrom,
    dateTo,
    cashierId,
    paymentMethod,
    options,
    onPresetChange,
    onDateFromChange,
    onDateToChange,
    onCashierChange,
    onPaymentMethodChange,
  } = props

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={preset} onValueChange={(value) => onPresetChange(value as DashboardPreset)}>
          <SelectTrigger className="w-full rounded-2xl sm:w-[190px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {preset === 'custom' ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input type="date" value={dateFrom} onChange={(event) => onDateFromChange(event.target.value)} className="rounded-2xl" />
            <Input type="date" value={dateTo} onChange={(event) => onDateToChange(event.target.value)} className="rounded-2xl" />
          </div>
        ) : null}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-2xl text-base">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[320px] rounded-3xl text-base">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-base font-medium">Cashier</p>
              <Select value={cashierId || 'all'} onValueChange={(value) => onCashierChange(value === 'all' ? '' : value)}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="All cashiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cashiers</SelectItem>
                  {options?.cashiers.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-base font-medium">Payment method</p>
              <Select value={paymentMethod || 'all'} onValueChange={(value) => onPaymentMethodChange(value === 'all' ? '' : value)}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="All payment methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payment methods</SelectItem>
                  {options?.payment_methods.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
