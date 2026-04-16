'use client';

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCustomers } from '@/hooks/queries/useCustomers'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useCreateSale, useUpdateSale } from '@/hooks/mutations/useSales'
import type { PaymentMethod, Sale } from '@/types/sales'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
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

type FormValues = z.input<typeof schema>
type FormData = z.output<typeof schema>

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
  } = useForm<FormValues, unknown, FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
      return
    }

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
  }, [sale, reset])

  const onSubmit = async (data: FormData) => {
    if (!isEditing && data.items.length === 0) {
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
          items: data.items,
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
      description="Fill in sale details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Sale Information">
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Customer">
                <Select
                  value={watch('customer') || ''}
                  onValueChange={(value) => setValue('customer', value, { shouldValidate: true })}
                >
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
              </FormFieldWrapper>

              <FormFieldWrapper label="Sale Date" htmlFor="sale_date">
                <Input id="sale_date" type="date" {...register('sale_date')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormFieldWrapper label="Tax Amount" htmlFor="tax_amount">
                <Input id="tax_amount" placeholder="0.00" {...register('tax_amount')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Discount Amount" htmlFor="discount_amount">
                <Input id="discount_amount" placeholder="0.00" {...register('discount_amount')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Payment Method" error={errors.payment_method?.message}>
                <Select
                  value={watch('payment_method')}
                  onValueChange={(value) => setValue('payment_method', value as PaymentMethod, { shouldValidate: true })}
                >
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
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Notes" htmlFor="notes">
              <Textarea id="notes" placeholder="Optional sale notes" {...register('notes')} />
            </FormFieldWrapper>
          </FormSection>

          {!isEditing && (
            <>
              <FormSection title="Payment Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormFieldWrapper label="Payment Amount" htmlFor="payment_amount">
                    <Input id="payment_amount" placeholder="0.00" {...register('payment_amount')} />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Transaction Ref" htmlFor="transaction_ref">
                    <Input id="transaction_ref" placeholder="Reference ID" {...register('transaction_ref')} />
                  </FormFieldWrapper>
                </div>
              </FormSection>

              <FormSection title="Sale Items" description="Add medicine line items for this sale.">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Add at least one item.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ medicine: '', quantity: 1, unit_price: '', batch_number: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                    No items added yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border border-border/60 p-3">
                        <div className="grid gap-3 md:grid-cols-6">
                          <FormFieldWrapper label="Medicine" className="md:col-span-2" error={errors.items?.[index]?.medicine?.message}>
                            <Select
                              value={watch(`items.${index}.medicine`) || ''}
                              onValueChange={(value) => {
                                setValue(`items.${index}.medicine`, value, { shouldValidate: true })
                                const selected = safeMedicines.find((medicine) => medicine.id === value)
                                if (selected) {
                                  setValue(`items.${index}.unit_price`, String(selected.selling_price), { shouldValidate: true })
                                  setValue(`items.${index}.batch_number`, selected.batch_number, { shouldValidate: true })
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Search medicine"
                                    value={medicineSearch}
                                    onChange={(event) => setMedicineSearch(event.target.value)}
                                  />
                                </div>
                                {safeMedicines
                                  .filter((medicine) =>
                                    `${medicine.name} ${medicine.batch_number} ${medicine.generic_name ?? ''}`
                                      .toLowerCase()
                                      .includes(medicineSearch.toLowerCase()),
                                  )
                                  .map((medicine) => (
                                    <SelectItem key={medicine.id} value={medicine.id}>
                                      {medicine.name} ({medicine.batch_number})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Qty" error={errors.items?.[index]?.quantity?.message}>
                            <Input type="number" min={1} placeholder="1" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Unit Price" error={errors.items?.[index]?.unit_price?.message}>
                            <Input
                              placeholder="0.00"
                              {...register(`items.${index}.unit_price`)}
                              disabled={!!watch(`items.${index}.medicine`)}
                            />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Batch" error={errors.items?.[index]?.batch_number?.message}>
                            <Input
                              placeholder="Batch"
                              {...register(`items.${index}.batch_number`)}
                              disabled={!!watch(`items.${index}.medicine`)}
                            />
                          </FormFieldWrapper>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </FormSection>
            </>
          )}

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Sale' : 'Create Sale'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
