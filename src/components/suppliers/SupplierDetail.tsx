import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Supplier } from '@/types/suppliers'

interface SupplierDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
}

export function SupplierDetail({ open, onOpenChange, supplier }: SupplierDetailProps) {
  if (!supplier) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Supplier Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{supplier.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
              {supplier.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Contact Person</p>
            <p>{supplier.contact_person || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{supplier.phone}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{supplier.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax ID</p>
            <p>{supplier.tax_id || '-'}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p>{supplier.address || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <p>{supplier.total_purchases}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Medicines</p>
            <p>{supplier.active_medicines_count}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(supplier.created_at), 'PPP')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{format(new Date(supplier.updated_at), 'PPP')}</p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
