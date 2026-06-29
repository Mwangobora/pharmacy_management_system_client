'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatTzsCurrency } from '@/lib/currency'
import type { Medicine } from '@/types/inventory'
import { getMaxSellableUnits, getSaleUnits, getStockTone, getUnitPriceFromBase, isMedicineExpired, isMedicineExpiringSoon } from './utils'

interface MedicineDetailsSheetProps {
  medicine: Medicine | null
  quantity: number
  unitName: string
  onAddToCart: (medicine: Medicine, quantity: number, unitName: string) => void
  onClose: () => void
  onQuantityChange: (quantity: number) => void
  onUnitNameChange: (unitName: string) => void
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
  unitName,
  onAddToCart,
  onClose,
  onQuantityChange,
  onUnitNameChange,
}: MedicineDetailsSheetProps) {
  const stockTone = medicine ? getStockTone(medicine) : 'out'
  const saleUnits = medicine ? getSaleUnits(medicine) : []
  const selectedUnit = medicine ? saleUnits.find((item) => item.unit_name === unitName) ?? saleUnits[0] : null
  const maxQuantity = medicine ? getMaxSellableUnits(medicine, selectedUnit?.unit_name) : 0
  const unitPrice = medicine && selectedUnit
    ? getUnitPriceFromBase(medicine.selling_price, selectedUnit.factor_to_base_unit)
    : 0

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
                <MedicineMeta label="Base unit" value={medicine.base_unit} />
                <MedicineMeta label="Selling price" value={formatTzsCurrency(unitPrice)} />
                <MedicineMeta label="Available stock" value={`${medicine.stock_quantity} ${medicine.base_unit}`} />
                <MedicineMeta label="Batch number" value={medicine.batch_number || 'Pending first batch'} />
                <MedicineMeta label="Expiry date" value={medicine.expiry_date || 'Pending batch'} />
                <MedicineMeta label="Barcode" value={medicine.barcode || '-'} />
                <MedicineMeta label="Storage location" value={medicine.storage_location || '-'} />
              </div>

              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-medium">Configured sale units</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">Choose unit</p>
                    <Select value={selectedUnit?.unit_name ?? ''} onValueChange={onUnitNameChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sale unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {saleUnits.map((item) => (
                          <SelectItem key={item.id} value={item.unit_name}>
                            {item.unit_name} ({item.factor_to_base_unit} {medicine.base_unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 text-sm">
                    <p className="text-muted-foreground">Maximum sellable in selected unit</p>
                    <p className="mt-1 font-semibold">{maxQuantity} {selectedUnit?.unit_name ?? medicine.base_unit}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-medium">Batch availability</p>
                <div className="mt-3 space-y-2">
                  {(medicine.batches || []).filter((item) => item.quantity_on_hand > 0).map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between rounded-lg bg-muted/35 px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium">{batch.batch_number}</p>
                        <p className="text-xs text-muted-foreground">Expiry {batch.expiry_date}</p>
                      </div>
                      <div className="text-right">
                        <p>{batch.quantity_on_hand} {medicine.base_unit}</p>
                        <p className="text-xs text-muted-foreground">{formatTzsCurrency(batch.selling_price || medicine.selling_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                    max={Math.max(maxQuantity, 1)}
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
                disabled={medicine.stock_quantity <= 0 || isMedicineExpired(medicine) || !selectedUnit || maxQuantity <= 0}
                onClick={() => selectedUnit && onAddToCart(medicine, quantity, selectedUnit.unit_name)}
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
