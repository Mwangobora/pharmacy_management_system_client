'use client'

import { useEffect, useState } from 'react'
import { Minus, Pill, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatTzsCurrency } from '@/lib/currency'
import type { PosCartLine } from './types'

interface CartItemsListProps {
  items: PosCartLine[]
  onRemove: (lineId: string) => void
  onUpdateQuantity: (item: PosCartLine, quantity: number) => void
}

export function CartItemsList({ items, onRemove, onUpdateQuantity }: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
        <Pill className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No medicines added yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Search and add medicines from the left panel to begin a sale.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.lineId} className="rounded-xl border border-border/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.medicine.name}</p>
              <p className="text-xs text-muted-foreground">
                {[item.medicine.generic_name, item.unitName].filter(Boolean).join(' · ')}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Batch: {item.medicine.batch_number || 'N/A'}</span>
                <span>{formatTzsCurrency(item.unitPrice)} per {item.unitName}</span>
                <span>1 {item.unitName} = {item.factorToBaseUnit} {item.medicine.base_unit}</span>
                <span>Available: {Math.floor(item.medicine.stock_quantity / item.factorToBaseUnit)} {item.unitName}</span>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.lineId)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => onUpdateQuantity(item, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <QuantityInput
                quantity={item.quantity}
                max={Math.max(Math.floor(item.medicine.stock_quantity / item.factorToBaseUnit), 1)}
                onCommit={(quantity) => onUpdateQuantity(item, quantity)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => onUpdateQuantity(item, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-sm font-semibold">{formatTzsCurrency(item.lineTotal)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface QuantityInputProps {
  quantity: number
  max: number
  onCommit: (quantity: number) => void
}

/**
 * Buffers the raw text locally so the field can sit empty while the user is
 * retyping a value (e.g. backspacing "1" to type "5"). The cart is only ever
 * updated once a valid positive number lands - an empty/zero field never
 * reaches onUpdateQuantity, which is what used to delete the whole cart line
 * out from under the input mid-edit.
 */
function QuantityInput({ quantity, max, onCommit }: QuantityInputProps) {
  const [text, setText] = useState(String(quantity))

  useEffect(() => {
    setText(String(quantity))
  }, [quantity])

  const handleBlur = () => {
    const parsed = Number(text)
    if (!text || !Number.isFinite(parsed) || parsed < 1) {
      setText(String(quantity))
      return
    }
    const clamped = Math.min(Math.floor(parsed), max)
    setText(String(clamped))
    if (clamped !== quantity) onCommit(clamped)
  }

  return (
    <Input
      type="number"
      min={1}
      max={max}
      value={text}
      onChange={(event) => {
        const raw = event.target.value
        setText(raw)
        const parsed = Number(raw)
        if (raw && Number.isFinite(parsed) && parsed >= 1) {
          onCommit(Math.min(Math.floor(parsed), max))
        }
      }}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
      className="h-10 w-20 text-center"
    />
  )
}
