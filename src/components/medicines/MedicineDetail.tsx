import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Medicine } from '@/types/inventory'

interface MedicineDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
}

export function MedicineDetail({ open, onOpenChange, medicine }: MedicineDetailProps) {
  if (!medicine) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Medicine Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{medicine.name}</p></div>
          <div><p className="text-sm text-muted-foreground">Generic Name</p><p>{medicine.generic_name}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Category</p><p>{medicine.category_name}</p></div>
          <div><p className="text-sm text-muted-foreground">Supplier</p><p>{medicine.supplier_name}</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-sm text-muted-foreground">Batch Number</p><p>{medicine.batch_number}</p></div>
          <div><p className="text-sm text-muted-foreground">Manufacture Date</p><p>{medicine.manufacture_date}</p></div>
          <div><p className="text-sm text-muted-foreground">Expiry Date</p><p className={medicine.days_to_expiry <= 30 ? 'text-destructive' : ''}>{medicine.expiry_date} ({medicine.days_to_expiry} days)</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-sm text-muted-foreground">Purchase Price</p><p>${medicine.purchase_price}</p></div>
          <div><p className="text-sm text-muted-foreground">Selling Price</p><p>${medicine.selling_price}</p></div>
          <div><p className="text-sm text-muted-foreground">Profit/Unit</p><p className="text-green-600">${medicine.profit_per_unit}</p></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div><p className="text-sm text-muted-foreground">Stock</p><p>{medicine.stock_quantity} {medicine.unit}</p></div>
          <div><p className="text-sm text-muted-foreground">Min</p><p>{medicine.min_stock_level}</p></div>
          <div><p className="text-sm text-muted-foreground">Max</p><p>{medicine.max_stock_level}</p></div>
          <div><p className="text-sm text-muted-foreground">Storage</p><p>{medicine.storage_location || '-'}</p></div>
        </div>
        <div className="flex gap-4">
          <Badge variant={medicine.requires_prescription ? 'destructive' : 'secondary'}>{medicine.requires_prescription ? 'Prescription Required' : 'OTC'}</Badge>
          <Badge variant={medicine.is_active ? 'default' : 'secondary'}>{medicine.is_active ? 'Active' : 'Inactive'}</Badge>
        </div>
      </div>
    </ResponsiveModal>
  )
}
