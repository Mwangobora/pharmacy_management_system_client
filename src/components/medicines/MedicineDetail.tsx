import { AlertTriangle, CalendarClock, ClipboardList, MapPin, Pill, Warehouse } from 'lucide-react'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Card, CardContent } from '@/components/ui/card'
import { formatTzsCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import type { Medicine } from '@/types/inventory'
import type { MedicineStatusState } from '@/types/medicine-detail'
import { MedicineDetailHero } from './detail/MedicineDetailHero'
import { MedicineDetailSection } from './detail/MedicineDetailSection'
import { MedicineQuickRow } from './detail/MedicineQuickRow'
import { MedicineTimelineCard } from './detail/MedicineTimelineCard'

interface MedicineDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
}

export function MedicineDetail({ open, onOpenChange, medicine }: MedicineDetailProps) {
  if (!medicine) return null

  const stockState: MedicineStatusState =
    medicine.stock_quantity <= medicine.min_stock_level
      ? {
          label: 'Low stock',
          tone:
            'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
        }
      : medicine.stock_quantity >= medicine.max_stock_level
        ? {
            label: 'Overstocked',
            tone:
              'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
          }
        : {
            label: 'Healthy stock',
            tone:
              'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300',
          }

  const expiryState: MedicineStatusState =
    medicine.days_to_expiry <= 30
      ? {
          label: 'Expiring soon',
          tone:
            'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
        }
      : {
          label: 'Shelf life OK',
          tone:
            'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300',
        }

  const manufactureDateLabel = formatDate(medicine.manufacture_date)
  const expiryDateLabel = formatDate(medicine.expiry_date)
  const sellingPrice = formatTzsCurrency(medicine.selling_price)
  const purchasePrice = formatTzsCurrency(medicine.purchase_price)
  const profitPerUnit = formatTzsCurrency(medicine.profit_per_unit)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Medicine Details"
      description="Review stock, pricing, supplier, and batch information in one place."
      dialogContentClassName="sm:max-w-4xl"
    >
      <div className="space-y-6 pb-1">
        <MedicineDetailHero
          medicine={medicine}
          stockState={stockState}
          expiryState={expiryState}
          sellingPrice={sellingPrice}
          purchasePrice={purchasePrice}
          profitPerUnit={profitPerUnit}
          expiryLabel={`${medicine.days_to_expiry} days`}
          expiryDateLabel={expiryDateLabel}
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <MedicineDetailSection
            title="Product Overview"
            description="Key reference details for this medicine"
            icon={Pill}
            items={[
              { label: 'Category', value: medicine.category_name },
              { label: 'Supplier', value: medicine.supplier_name },
              { label: 'Unit Type', value: medicine.unit },
              { label: 'Barcode', value: medicine.barcode || 'Not assigned' },
            ]}
          />

          <MedicineDetailSection
            title="Storage & Compliance"
            description="Operational details used during stock handling"
            icon={Warehouse}
            items={[
              { label: 'Storage Location', value: medicine.storage_location || 'Not assigned' },
              { label: 'Prescription', value: medicine.requires_prescription ? 'Required' : 'Not required' },
              { label: 'Status', value: medicine.is_active ? 'Available for sale' : 'Hidden from operations' },
              { label: 'Batch', value: medicine.batch_number },
            ]}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Batch Timeline</h4>
                  <p className="text-sm text-muted-foreground">Manufacturing and expiry checkpoints</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <MedicineTimelineCard
                  icon={CalendarClock}
                  label="Manufactured"
                  value={manufactureDateLabel}
                  caption="Source production date"
                />
                <MedicineTimelineCard
                  icon={AlertTriangle}
                  label="Expires"
                  value={expiryDateLabel}
                  caption={`${medicine.days_to_expiry} days remaining`}
                  tone={medicine.days_to_expiry <= 30 ? 'danger' : 'default'}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Quick Checks</h4>
                  <p className="text-sm text-muted-foreground">Operational details for fast review</p>
                </div>
              </div>

              <div className="space-y-3">
                <MedicineQuickRow label="Batch Number" value={medicine.batch_number} />
                <MedicineQuickRow
                  label="Shelf Slot"
                  value={medicine.storage_location || 'Pending assignment'}
                />
                <MedicineQuickRow
                  label="Barcode"
                  value={medicine.barcode || 'Missing barcode'}
                />
                <MedicineQuickRow
                  label="Controlled Access"
                  value={
                    medicine.requires_prescription
                      ? 'Pharmacist review needed'
                      : 'Can be sold directly'
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveModal>
  )
}
