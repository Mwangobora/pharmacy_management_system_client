import { BadgeDollarSign, Box, CalendarClock, PackageCheck, Pill } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { MedicineMetricCard } from './MedicineMetricCard'
import type { Medicine } from '@/types/inventory'
import type { MedicineMetricItem, MedicineStatusState } from '@/types/medicine-detail'

interface MedicineDetailHeroProps {
  medicine: Medicine
  stockState: MedicineStatusState
  expiryState: MedicineStatusState
  sellingPrice: string
  purchasePrice: string
  profitPerUnit: string
  expiryLabel: string
  expiryDateLabel: string
}

export function MedicineDetailHero({
  medicine,
  stockState,
  expiryState,
  sellingPrice,
  purchasePrice,
  profitPerUnit,
  expiryLabel,
  expiryDateLabel,
}: MedicineDetailHeroProps) {
  const metrics: MedicineMetricItem[] = [
    {
      icon: PackageCheck,
      label: 'Stock On Hand',
      value: `${medicine.stock_quantity} ${medicine.unit}`,
      hint: `Min ${medicine.min_stock_level} / Max ${medicine.max_stock_level}`,
    },
    {
      icon: BadgeDollarSign,
      label: 'Selling Price',
      value: sellingPrice,
      hint: `Buy at ${purchasePrice}`,
    },
    {
      icon: Box,
      label: 'Profit Per Unit',
      value: profitPerUnit,
      hint: medicine.markup_percentage
        ? `${medicine.markup_percentage}% markup`
        : 'Markup auto-calculated',
    },
    {
      icon: CalendarClock,
      label: 'Expiry Window',
      value: expiryLabel,
      hint: expiryDateLabel,
      tone: medicine.days_to_expiry <= 30 ? 'danger' : 'default',
    },
  ]

  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-sky-50 via-background to-emerald-50 dark:from-sky-950/30 dark:via-background dark:to-emerald-950/20">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700 dark:text-sky-300">
              <Pill className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">{medicine.name}</h3>
              <p className="text-sm text-muted-foreground">
                {medicine.generic_name || 'Generic name not recorded'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={cn('border px-3 py-1 text-xs font-medium', stockState.tone)}>
              {stockState.label}
            </Badge>
            <Badge className={cn('border px-3 py-1 text-xs font-medium', expiryState.tone)}>
              {expiryState.label}
            </Badge>
            <Badge variant={medicine.requires_prescription ? 'destructive' : 'secondary'}>
              {medicine.requires_prescription ? 'Prescription required' : 'Over the counter'}
            </Badge>
            <Badge variant={medicine.is_active ? 'default' : 'secondary'}>
              {medicine.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MedicineMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  )
}

