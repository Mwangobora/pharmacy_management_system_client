'use client';

import { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
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
import { notify } from '@/lib/notify'
import { getSaleUnits, getUnitConversion, getUnitPriceFromBase } from './pos/utils'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_name: z.string().min(1, 'Selling unit is required'),
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
      const conversion = getUnitConversion(medicine, item.unit_name || medicine.base_unit || medicine.unit)
      const unitPrice = getUnitPriceFromBase(medicine.selling_price, conversion.factor_to_base_unit)
      const qty = Number(item.quantity || 0)
      subtotal += unitPrice * qty
    }
    return subtotal
  }, [watchedItems, safeMedicines])

  const onSubmit = async (data: FormData) => {
    if (!isEditing && data.items.length === 0) {
      notify.warning('Add at least one sale item', {
        description: 'Select at least one medicine before completing the sale.',
      })
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
        notify.success('Sale updated successfully')
      } else {
        await createSale.mutateAsync({
          customer: data.customer || undefined,
          payment_method: data.payment_method,
          notes: data.notes || undefined,
          items: data.items.map((item) => ({
            medicine: item.medicine,
            quantity: item.quantity,
            unit_name: item.unit_name || undefined,
          })),
        })
        notify.success('Sale completed successfully', {
          description: 'The sale was saved and stock quantities were updated successfully.',
        })
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Sale could not be updated' : 'Sale could not be completed', {
        fallback: isEditing
          ? 'The sale changes could not be saved.'
          : 'The sale could not be completed because stock or payment details changed.',
        persistent: !isEditing,
      })
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
      desktopScrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
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
            <FormSection title="Items" description="Select the selling unit and quantity. The form shows the conversion, available quantity, and price before checkout.">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">Subtotal preview: {formatTzsCurrency(totalsPreview)}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => append({ medicine: '', quantity: 1, unit_name: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No items added yet.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full sm:w-auto"
                    onClick={() => append({ medicine: '', quantity: 1, unit_name: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const selectedMedicineId = watch(`items.${index}.medicine`)
                    const selectedMedicine = safeMedicines.find((medicine) => medicine.id === selectedMedicineId)
                    const selectedUnitName = watch(`items.${index}.unit_name`) || selectedMedicine?.base_unit || selectedMedicine?.unit
                    const selectedUnit = selectedMedicine ? getUnitConversion(selectedMedicine, selectedUnitName) : null
                    const unitPrice = selectedMedicine && selectedUnit
                      ? getUnitPriceFromBase(selectedMedicine.selling_price, selectedUnit.factor_to_base_unit)
                      : 0
                    const lineQty = Number(watch(`items.${index}.quantity`) || 0)
                    const lineTotal = unitPrice * lineQty

                    return (
                      <div key={field.id} className="rounded-lg border border-border/60 p-3">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                          <FormFieldWrapper label="Medicine" className="sm:col-span-2 xl:col-span-2" error={errors.items?.[index]?.medicine?.message}>
                            <Select
                              value={selectedMedicineId || ''}
                              onValueChange={(value) => {
                                setValue(`items.${index}.medicine`, value, { shouldValidate: true })
                                const medicine = safeMedicines.find((item) => item.id === value)
                                const unit = medicine ? getSaleUnits(medicine)[0]?.unit_name ?? medicine.base_unit ?? medicine.unit : ''
                                setValue(`items.${index}.unit_name`, unit, { shouldValidate: true })
                              }}
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

                          <FormFieldWrapper label="Unit">
                            <Select
                              value={selectedUnitName || ''}
                              onValueChange={(value) => setValue(`items.${index}.unit_name`, value, { shouldValidate: true })}
                              disabled={!selectedMedicine}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {(selectedMedicine ? getSaleUnits(selectedMedicine) : []).map((unit) => (
                                  <SelectItem key={unit.id} value={unit.unit_name}>
                                    {unit.unit_name}
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

                          <FormFieldWrapper label="Line Total" className="sm:col-span-2 xl:col-span-1">
                            <Input value={lineTotal ? formatTzsCurrency(lineTotal) : ''} readOnly disabled placeholder="Auto" />
                          </FormFieldWrapper>
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3 text-sm">
                            {selectedMedicine && selectedUnit
                              ? `1 ${selectedUnit.unit_name} = ${selectedUnit.factor_to_base_unit} ${selectedMedicine.base_unit}`
                              : 'Select a medicine and selling unit to see the conversion.'}
                          </div>
                          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3 text-sm">
                            {selectedMedicine && selectedUnit
                              ? `Available: ${Math.floor(selectedMedicine.stock_quantity / selectedUnit.factor_to_base_unit)} ${selectedUnit.unit_name} (${selectedMedicine.stock_quantity} ${selectedMedicine.base_unit})`
                              : 'Available quantity appears here.'}
                          </div>
                          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3 text-sm">
                            {selectedMedicine
                              ? selectedMedicine.unit_review_required
                                ? 'Legacy unit needs admin review before trusting pack counts.'
                                : 'Base unit confirmed.'
                              : 'Medicine unit status appears here.'}
                          </div>
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

              {fields.length > 0 ? (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => append({ medicine: '', quantity: 1, unit_name: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Item
                  </Button>
                </div>
              ) : null}
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
