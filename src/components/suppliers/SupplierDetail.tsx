import { Edit, MapPin, Phone, ReceiptText, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { DetailHero } from '@/components/detail/DetailHero'
import { DetailInfoCard } from '@/components/detail/DetailInfoCard'
import type { DetailMetricItem } from '@/components/detail/types'
import { useSupplier } from '@/hooks/queries/useSuppliers'
import { formatDate } from '@/lib/date'
import type { Supplier } from '@/types/suppliers'

interface SupplierDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
  onEdit?: (supplier: Supplier) => void
  onDelete?: (supplier: Supplier) => void
}

export function SupplierDetail({ open, onOpenChange, supplier, onEdit, onDelete }: SupplierDetailProps) {
  // The table row only carries the lightweight list shape (id, name, phone,
  // email, is_active) - fetch the full record for purchase/medicine counts.
  const supplierId = open && supplier ? supplier.id : ''
  const { data: supplierDetails } = useSupplier(supplierId)
  const resolvedSupplier = supplierDetails ?? supplier

  if (!resolvedSupplier) return null

  // The list row doesn't include these counts, so show a neutral placeholder
  // until the full supplier record has loaded instead of printing "undefined".
  const metrics: DetailMetricItem[] = [
    {
      icon: ReceiptText,
      label: 'Purchase Orders',
      value: resolvedSupplier.total_purchases !== undefined ? `${resolvedSupplier.total_purchases}` : '—',
      hint: 'Total orders recorded from this supplier',
    },
    {
      icon: Truck,
      label: 'Active Medicines',
      value: resolvedSupplier.active_medicines_count !== undefined ? `${resolvedSupplier.active_medicines_count}` : '—',
      hint: 'Medicines currently supplied',
    },
  ]

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Supplier Details"
      description="Contact details, purchase history, and status for this vendor."
      dialogContentClassName="sm:max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onOpenChange(false)
                onDelete(resolvedSupplier)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit(resolvedSupplier)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Supplier
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6 pb-1">
        <DetailHero
          icon={Truck}
          title={resolvedSupplier.name}
          subtitle={resolvedSupplier.contact_person ? `Contact: ${resolvedSupplier.contact_person}` : 'No contact person on file'}
          metrics={metrics}
          gradientClassName="from-orange-50 via-background to-amber-50 dark:from-orange-950/30 dark:via-background dark:to-amber-950/20"
          iconClassName="bg-orange-600/10 text-orange-700 dark:text-orange-300"
          badges={[
            { label: resolvedSupplier.is_active ? 'Active' : 'Inactive', variant: resolvedSupplier.is_active ? 'default' : 'secondary' },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <DetailInfoCard
            title="Contact Information"
            description="How to reach this supplier"
            icon={Phone}
            items={[
              { label: 'Phone', value: resolvedSupplier.phone },
              { label: 'Email', value: resolvedSupplier.email || 'Not provided' },
            ]}
          />

          <DetailInfoCard
            title="Business Details"
            description="Compliance and account reference"
            icon={ReceiptText}
            items={[
              { label: 'Tax ID (TIN)', value: resolvedSupplier.tax_id || 'Not provided' },
              { label: 'Supplier Since', value: formatDate(resolvedSupplier.created_at) },
            ]}
          />
        </div>

        <DetailInfoCard
          title="Address"
          description="Delivery and correspondence address"
          icon={MapPin}
          items={[{ label: 'Address', value: resolvedSupplier.address || 'Not provided' }]}
        />
      </div>
    </ResponsiveModal>
  )
}
