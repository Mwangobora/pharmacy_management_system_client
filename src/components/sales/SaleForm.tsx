'use client';

import { useEffect, useState } from 'react'
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
import { useCustomers } from '@/hooks/queries/useCustomers'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useCreateSale, useUpdateSale } from '@/hooks/mutations/useSales'
import type { PaymentMethod, Sale } from '@/types/sales'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity is required'),
  unit_price: z.string().min(1, 'Unit price is required'),
  batch_number: z.string().min(1, 'Batch number is required'),
})

const schema = z.object({
  customer: z.string().optional(),
  sale_date: z.string().optional(),
  tax_amount: z.string().optional(),
  discount_amount: z.string().optional(),
  payment_method: z.enum(['cash', 'card', 'mobile', 'insurance', 'credit']),
  notes: z.string().optional(),
  items: z.array(itemSchema).default([]),
  payment_amount: z.string().optional(),
  transaction_ref: z.string().optional(),
})

type FormData = z.input<typeof schema>

interface SaleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile Money' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'credit', label: 'Credit' },
]

export function SaleForm({ open, onOpenChange, sale }: SaleFormProps) {
  const { data: customers = [] } = useCustomers()
  const safeCustomers = Array.isArray(customers) ? customers : []
  const { data: medicines = [] } = useMedicines()
  const safeMedicines = Array.isArray(medicines) ? medicines : []
  const createSale = useCreateSale()
  const updateSale = useUpdateSale()
  const isEditing = !!sale
  const [medicineSearch, setMedicineSearch] = useState('')

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
      customer: '',
      sale_date: '',
      tax_amount: '',
      discount_amount: '',
      payment_method: 'cash',
      notes: '',
      items: [],
      payment_amount: '',
      transaction_ref: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    if (sale) {
      reset({
        customer: sale.customer || '',
        sale_date: sale.sale_date,
        tax_amount: sale.tax_amount || '',
        discount_amount: sale.discount_amount || '',
        payment_method: sale.payment_method,
        notes: sale.notes || '',
        items: [],
        payment_amount: '',
        transaction_ref: '',
      })
    } else {
      reset({
        customer: '',
        sale_date: '',
        tax_amount: '',
        discount_amount: '',
        payment_method: 'cash',
        notes: '',
        items: [],
        payment_amount: '',
        transaction_ref: '',
      })
    }
  }, [sale, reset])

  const onSubmit = async (data: FormData) => {
    if (!isEditing && (!data.items || data.items.length === 0)) {
      toast.error('Add at least one item')
      return
    }

    try {
      if (isEditing) {
        await updateSale.mutateAsync({
          id: sale.id,
          payload: {
            sale_date: data.sale_date || undefined,
            tax_amount: data.tax_amount || undefined,
            discount_amount: data.discount_amount || undefined,
            payment_method: data.payment_method,
            notes: data.notes || undefined,
          },
        })
        toast.success('Sale updated successfully')
      } else {
        await createSale.mutateAsync({
          customer: data.customer || undefined,
          sale_date: data.sale_date || undefined,
          tax_amount: data.tax_amount || undefined,
          discount_amount: data.discount_amount || undefined,
          payment_method: data.payment_method,
          notes: data.notes || undefined,
          items: data.items || [],
          payment_amount: data.payment_amount || undefined,
          transaction_ref: data.transaction_ref || undefined,
        })
        toast.success('Sale created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update sale' : 'Failed to create sale')
    }
  }

  const isLoading = createSale.isPending || updateSale.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Sale' : 'Add Sale'}
      description="Fill in the sale details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={watch('customer') || ''} onValueChange={(v) => setValue('customer', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Walk-in customer" />
              </SelectTrigger>
              <SelectContent>
                {safeCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sale_date">Sale Date</Label>
            <Input id="sale_date" type="date" {...register('sale_date')} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax_amount">Tax Amount</Label>
            <Input id="tax_amount" {...register('tax_amount')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_amount">Discount Amount</Label>
            <Input id="discount_amount" {...register('discount_amount')} />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={watch('payment_method')} onValueChange={(v) => setValue('payment_method', v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} />
        </div>

        {!isEditing && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_amount">Payment Amount</Label>
                <Input id="payment_amount" {...register('payment_amount')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction_ref">Transaction Ref</Label>
                <Input id="transaction_ref" {...register('transaction_ref')} />
              </div>
            </div>
            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-xs text-muted-foreground">Add medicines for this sale</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ medicine: '', quantity: 1, unit_price: '', batch_number: '' })}
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
                        <Label>Medicine</Label>
                        <Select
                          value={watch(`items.${index}.medicine`) || ''}
                          onValueChange={(value) => {
                            setValue(`items.${index}.medicine`, value)
                            const selected = safeMedicines.find((med) => med.id === value)
                            if (selected) {
                            setValue(`items.${index}.unit_price`, String(selected.selling_price))
                            setValue(`items.${index}.batch_number`, selected.batch_number)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search medicines..."
                              value={medicineSearch}
                              onChange={(event) => setMedicineSearch(event.target.value)}
                            />
                          </div>
                          {safeMedicines
                            .filter((medicine) =>
                              `${medicine.name} ${medicine.batch_number} ${medicine.generic_name ?? ''}`
                                .toLowerCase()
                                .includes(medicineSearch.toLowerCase())
                            )
                            .map((medicine) => (
                              <SelectItem key={medicine.id} value={medicine.id}>
                                <div className="flex w-full items-center justify-between gap-2">
                                  <span>
                                    {medicine.name} ({medicine.batch_number})
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Stock: {medicine.stock_quantity}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                      <div className="space-y-1">
                        <Label>Qty</Label>
                        <Input type="number" {...register(`items.${index}.quantity`)} />
                      </div>
                      <div className="space-y-1">
                        <Label>Unit Price</Label>
                        <Input
                          {...register(`items.${index}.unit_price`)}
                          disabled={!!watch(`items.${index}.medicine`)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Batch</Label>
                        <Input
                          {...register(`items.${index}.batch_number`)}
                          disabled={!!watch(`items.${index}.medicine`)}
                        />
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
          </>
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
