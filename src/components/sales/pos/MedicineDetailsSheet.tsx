'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatTzsCurrency } from '@/lib/currency'
import type { Medicine } from '@/types/inventory'
import { getStockTone, isMedicineExpired, isMedicineExpiringSoon } from './utils'

interface MedicineDetailsSheetProps {
  medicine: Medicine | null
  quantity: number
  onAddToCart: (medicine: Medicine, quantity: number) => void
  onClose: () => void
  onQuantityChange: (quantity: number) => void
}

function MedicineMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  )
}

export function MedicineDetailsSheet({
  medicine,
  quantity,
  onAddToCart,
  onClose,
  onQuantityChange,
}: MedicineDetailsSheetProps) {
  const stockTone = medicine ? getStockTone(medicine) : 'out'

  return (
    <Sheet open={!!medicine} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        {medicine && (
          <div className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle>{medicine.name}</SheetTitle>
              <SheetDescription>
                Review stock, expiry and pricing before adding this medicine to the cart.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {stockTone === 'in' && <Badge>In stock</Badge>}
                {stockTone === 'low' && <Badge variant="secondary">Low stock</Badge>}
                {stockTone === 'out' && <Badge variant="destructive">Out of stock</Badge>}
                {medicine.requires_prescription && <Badge variant="outline">Prescription required</Badge>}
                {isMedicineExpiringSoon(medicine) && <Badge variant="outline">Expiring soon</Badge>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <MedicineMeta label="Generic name" value={medicine.generic_name} />
                <MedicineMeta label="Category" value={medicine.category_name} />
                <MedicineMeta label="Manufacturer" value={medicine.supplier_name} />
                <MedicineMeta label="Selling unit" value={medicine.unit} />
                <MedicineMeta label="Selling price" value={formatTzsCurrency(medicine.selling_price)} />
                <MedicineMeta label="Available stock" value={`${medicine.stock_quantity} ${medicine.unit}`} />
                <MedicineMeta label="Batch number" value={medicine.batch_number} />
                <MedicineMeta label="Expiry date" value={medicine.expiry_date} />
                <MedicineMeta label="Barcode" value={medicine.barcode || '-'} />
                <MedicineMeta label="Storage location" value={medicine.storage_location || '-'} />
              </div>

              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Add to cart</p>
                    <p className="text-xs text-muted-foreground">
                      FEFO stays aligned with the current batch-level medicine record.
                    </p>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={medicine.stock_quantity}
                    value={quantity}
                    onChange={(event) => onQuantityChange(Number(event.target.value || 1))}
                    className="w-24 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 p-4">
              <Button
                type="button"
                className="w-full"
                disabled={medicine.stock_quantity <= 0 || isMedicineExpired(medicine)}
                onClick={() => onAddToCart(medicine, quantity)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
