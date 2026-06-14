'use client'

import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Customer } from '@/types/sales'

interface CustomerSectionProps {
  customers: Customer[]
  customerId: string
  selectedCustomer: Customer | null
  customersLoading: boolean
  onChange: (value: string) => void
}

export function CustomerSection({
  customers,
  customerId,
  selectedCustomer,
  customersLoading,
  onChange,
}: CustomerSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Customer</h3>
        <Badge variant="outline">{selectedCustomer ? 'Registered' : 'Walk-in'}</Badge>
      </div>
      <Select value={customerId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Walk-in customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="walk-in">Walk-in customer</SelectItem>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCustomer && (
        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{selectedCustomer.full_name}</p>
          <p>{selectedCustomer.phone}</p>
          <p>Loyalty points: {selectedCustomer.loyalty_points}</p>
        </div>
      )}

      {customersLoading && <p className="text-xs text-muted-foreground">Loading customers...</p>}
    </div>
  )
}
