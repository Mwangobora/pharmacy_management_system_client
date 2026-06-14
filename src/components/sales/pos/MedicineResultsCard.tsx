'use client'

import { PackageSearch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatTzsCurrency } from '@/lib/currency'
import type { Medicine } from '@/types/inventory'
import { getStockTone, isMedicineExpired, isMedicineExpiringSoon } from './utils'

interface MedicineResultsCardProps {
  medicines: Medicine[]
  isLoading: boolean
  highlightedIndex: number
  searchQuery: string
  onAddToCart: (medicine: Medicine) => void
  onOpenDetails: (medicine: Medicine) => void
}

function MedicineEmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
      <PackageSearch className="h-10 w-10 text-muted-foreground" />
      <p className="mt-4 text-sm font-medium">No medicines found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a different medicine name, barcode, category, strength or generic name.
      </p>
    </div>
  )
}

function StockBadges({ medicine }: { medicine: Medicine }) {
  const stockTone = getStockTone(medicine)

  return (
    <>
      {stockTone === 'in' && <Badge>In stock</Badge>}
      {stockTone === 'low' && <Badge variant="secondary">Low stock</Badge>}
      {stockTone === 'out' && <Badge variant="destructive">Out of stock</Badge>}
      {medicine.requires_prescription && <Badge variant="outline">Prescription required</Badge>}
      {isMedicineExpiringSoon(medicine) && <Badge variant="outline">Expiring soon</Badge>}
    </>
  )
}

export function MedicineResultsCard({
  medicines,
  isLoading,
  highlightedIndex,
  searchQuery,
  onAddToCart,
  onOpenDetails,
}: MedicineResultsCardProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Medicines'}
        </CardTitle>
        <CardDescription>
          Stock, expiry, prescription status and price stay visible while you build the cart.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center" />
        ) : medicines.length === 0 ? (
          <MedicineEmptyState />
        ) : (
          <div className="space-y-3">
            {medicines.map((medicine, index) => {
              const outOfStock = getStockTone(medicine) === 'out'
              const expired = isMedicineExpired(medicine)

              return (
                <button
                  key={medicine.id}
                  type="button"
                  onClick={() => onOpenDetails(medicine)}
                  className={cn(
                    'w-full rounded-xl border border-border/60 bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md',
                    index === highlightedIndex && 'border-primary/50 ring-2 ring-primary/15',
                    (outOfStock || expired) && 'opacity-80'
                  )}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{medicine.name}</h3>
                        <StockBadges medicine={medicine} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {[medicine.generic_name, medicine.category_name, medicine.unit].filter(Boolean).join(' · ')}
                      </p>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                        <span>Batch: {medicine.batch_number || 'N/A'}</span>
                        <span>Stock: {medicine.stock_quantity} {medicine.unit}</span>
                        <span>Expiry: {medicine.expiry_date}</span>
                        {medicine.supplier_name && <span>Manufacturer: {medicine.supplier_name}</span>}
                      </div>
                    </div>

                    <div className="flex min-w-[190px] flex-col items-start gap-3 lg:items-end">
                      <div className="text-left lg:text-right">
                        <p className="text-lg font-semibold">{formatTzsCurrency(medicine.selling_price)}</p>
                        <p className="text-xs text-muted-foreground">per {medicine.unit}</p>
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button type="button" variant="outline" size="sm" onClick={() => onOpenDetails(medicine)}>
                          Details
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={outOfStock || expired}
                          onClick={() => onAddToCart(medicine)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
