'use client';

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useCreatePurchase, useUpdatePurchase } from '@/hooks/mutations/usePurchases'
import type { Purchase } from '@/types/suppliers'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity is required'),
  unit_price: z.string().min(1, 'Unit price is required'),
  discount_percent: z.string().optional(),
  tax_percent: z.string().optional(),
})

const schema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  tax_amount: z.string().optional(),
  discount_amount: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).default([]),
})

type FormData = z.input<typeof schema>

interface PurchaseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseForm({ open, onOpenChange, purchase }: PurchaseFormProps) {
  const { data: suppliers = [] } = useSuppliers()
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : []
  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()
  const isEditing = !!purchase

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      supplier: '',
      invoice_number: '',
      purchase_date: '',
      tax_amount: '',
      discount_amount: '',
      notes: '',
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    if (purchase) {
      reset({
        supplier: purchase.supplier,
        invoice_number: purchase.invoice_number,
        purchase_date: purchase.purchase_date,
        tax_amount: purchase.tax_amount || '',
        discount_amount: purchase.discount_amount || '',
        notes: purchase.notes || '',
        items: [],
      })
    } else {
      reset({
        supplier: '',
        invoice_number: '',
        purchase_date: '',
        tax_amount: '',
        discount_amount: '',
        notes: '',
        items: [],
      })
    }
  }, [purchase, reset])

  const onSubmit = async (data: FormData) => {
    if (!isEditing && (!data.items || data.items.length === 0)) {
      toast.error('Add at least one item')
      return
    }

    try {
      if (isEditing) {
        await updatePurchase.mutateAsync({
          id: purchase.id,
          payload: {
            invoice_number: data.invoice_number,
            purchase_date: data.purchase_date,
            tax_amount: data.tax_amount || undefined,
            discount_amount: data.discount_amount || undefined,
            notes: data.notes || undefined,
          },
        })
        toast.success('Purchase updated successfully')
      } else {
        await createPurchase.mutateAsync({
          supplier: data.supplier,
          invoice_number: data.invoice_number,
          purchase_date: data.purchase_date,
          tax_amount: data.tax_amount || undefined,
          discount_amount: data.discount_amount || undefined,
          notes: data.notes || undefined,
          items: data.items || [],
        })
        toast.success('Purchase created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update purchase' : 'Failed to create purchase')
    }
  }

  const isLoading = createPurchase.isPending || updatePurchase.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Purchase' : 'Add Purchase'}
      description="Fill in the purchase details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select
              value={watch('supplier')}
              onValueChange={(v) => setValue('supplier', v)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {safeSuppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplier && <p className="text-sm text-destructive">{errors.supplier.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input id="invoice_number" {...register('invoice_number')} />
            {errors.invoice_number && <p className="text-sm text-destructive">{errors.invoice_number.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input id="purchase_date" type="date" {...register('purchase_date')} />
            {errors.purchase_date && <p className="text-sm text-destructive">{errors.purchase_date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_amount">Tax Amount</Label>
            <Input id="tax_amount" {...register('tax_amount')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_amount">Discount Amount</Label>
            <Input id="discount_amount" {...register('discount_amount')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} />
        </div>

        {!isEditing && (
          <div className="space-y-3 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Items</p>
                <p className="text-xs text-muted-foreground">Add medicines for this purchase</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ medicine: '', quantity: 1, unit_price: '', discount_percent: '', tax_percent: '' })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items added yet.</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-6 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label>Medicine ID</Label>
                      <Input {...register(`items.${index}.medicine`)} placeholder="Medicine ID" />
                    </div>
                    <div className="space-y-1">
                      <Label>Qty</Label>
                      <Input type="number" {...register(`items.${index}.quantity`)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Unit Price</Label>
                      <Input {...register(`items.${index}.unit_price`)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Discount %</Label>
                      <Input {...register(`items.${index}.discount_percent`)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Tax %</Label>
                      <Input {...register(`items.${index}.tax_percent`)} />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
