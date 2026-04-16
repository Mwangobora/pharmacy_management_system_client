'use client';

import { useEffect, useMemo } from 'react'
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
import { formatTzsCurrency } from '@/lib/currency'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
})

const schema = z.object({
  customer: z.string().optional(),
  payment_method: z.enum(['cash', 'card', 'mobile', 'insurance', 'credit']),
  notes: z.string().optional(),
  items: z.array(itemSchema).default([]),
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
      payment_method: 'cash',
      notes: '',
      items: [],
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
        payment_method: sale.payment_method,
        notes: sale.notes || '',
        items: [],
      })
      return
    }

    reset({
      customer: '',
      payment_method: 'cash',
      notes: '',
      items: [],
    })
  }, [sale, reset, open])

  const watchedItems = watch('items') || []

  const totalsPreview = useMemo(() => {
    let subtotal = 0
    for (const item of watchedItems) {
      const medicine = safeMedicines.find((m) => m.id === item.medicine)
      if (!medicine) continue
      const unitPrice = Number(medicine.selling_price)
      const qty = Number(item.quantity || 0)
      subtotal += unitPrice * qty
    }
    return subtotal
  }, [watchedItems, safeMedicines])

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
            payment_method: data.payment_method,
            notes: data.notes || undefined,
            customer: data.customer || undefined,
          },
        })
        toast.success('Sale updated successfully')
      } else {
        await createSale.mutateAsync({
          customer: data.customer || undefined,
          payment_method: data.payment_method,
          notes: data.notes || undefined,
          items: data.items.map((item) => ({
            medicine: item.medicine,
            quantity: item.quantity,
          })),
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
      title={isEditing ? 'Edit Sale' : 'New Sale'}
      description="Fast checkout form"
      dialogContentClassName="sm:max-w-5xl"
      desktopScrollable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout className="max-w-none">
          <FormSection title="Sale Details">
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

            <FormFieldWrapper label="Notes">
              <Textarea placeholder="Optional note" {...register('notes')} className="min-h-10" />
            </FormFieldWrapper>
          </FormSection>

          {!isEditing && (
            <FormSection title="Items" description="Select medicine and quantity. Price is applied automatically.">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Subtotal preview: {formatTzsCurrency(totalsPreview)}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ medicine: '', quantity: 1 })}>
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
                  {fields.map((field, index) => {
                    const selectedMedicineId = watch(`items.${index}.medicine`)
                    const selectedMedicine = safeMedicines.find((medicine) => medicine.id === selectedMedicineId)
                    const unitPrice = selectedMedicine ? Number(selectedMedicine.selling_price) : 0
                    const lineQty = Number(watch(`items.${index}.quantity`) || 0)
                    const lineTotal = unitPrice * lineQty

                    return (
                      <div key={field.id} className="rounded-lg border border-border/60 p-3">
                        <div className="grid gap-3 md:grid-cols-6">
                          <FormFieldWrapper label="Medicine" className="md:col-span-3" error={errors.items?.[index]?.medicine?.message}>
                            <Select
                              value={selectedMedicineId || ''}
                              onValueChange={(value) => setValue(`items.${index}.medicine`, value, { shouldValidate: true })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                              <SelectContent>
                                {safeMedicines.map((medicine) => (
                                  <SelectItem key={medicine.id} value={medicine.id}>
                                    {medicine.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Qty" error={errors.items?.[index]?.quantity?.message}>
                            <Input type="number" min={1} placeholder="1" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Unit Price">
                            <Input value={unitPrice ? formatTzsCurrency(unitPrice) : ''} readOnly disabled placeholder="Auto" />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Line Total">
                            <Input value={lineTotal ? formatTzsCurrency(lineTotal) : ''} readOnly disabled placeholder="Auto" />
                          </FormFieldWrapper>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </FormSection>
          )}

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Sale' : 'Complete Sale'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
