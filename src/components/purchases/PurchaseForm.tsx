'use client';

import { useEffect } from 'react'
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
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useCreatePurchase, useUpdatePurchase } from '@/hooks/mutations/usePurchases'
import { notify } from '@/lib/notify'
import type { Purchase } from '@/types/suppliers'
import { getPurchaseUnits, getUnitConversion, getUnitPriceFromBase } from '@/components/sales/pos/utils'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.string().min(1, 'Unit cost is required'),
  unit_name: z.string().min(1, 'Purchase unit is required'),
  batch_number: z.string().min(1, 'Batch number is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  manufacture_date: z.string().min(1, 'Manufacture date is required'),
})

const schema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  invoice_number: z.string().trim().min(1, 'Invoice number is required'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  notes: z.string().optional(),
  items: z.array(itemSchema).default([]),
})

type FormValues = z.input<typeof schema>
type FormData = z.output<typeof schema>

interface PurchaseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseForm({ open, onOpenChange, purchase }: PurchaseFormProps) {
  const { data: suppliers = [] } = useSuppliers()
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : []
  const { data: medicines = [] } = useMedicines()
  const safeMedicines = Array.isArray(medicines) ? medicines : []
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
  } = useForm<FormValues, unknown, FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      supplier: '',
      invoice_number: '',
      purchase_date: '',
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
        notes: purchase.notes || '',
        items: [],
      })
      return
    }

    reset({
      supplier: '',
      invoice_number: '',
      purchase_date: new Date().toISOString().slice(0, 10),
      notes: '',
      items: [],
    })
  }, [purchase, reset, open])

  const onSubmit = async (data: FormData) => {
    if (!isEditing && (!data.items || data.items.length === 0)) {
      notify.warning('Add at least one purchase item', {
        description: 'Purchase receiving needs at least one medicine line before it can be saved.',
      })
      return
    }

    try {
      if (isEditing) {
        await updatePurchase.mutateAsync({
          id: purchase.id,
          payload: {
            invoice_number: data.invoice_number,
            purchase_date: data.purchase_date,
            notes: data.notes || undefined,
          },
        })
        notify.success('Purchase updated successfully')
      } else {
        await createPurchase.mutateAsync({
          supplier: data.supplier,
          invoice_number: data.invoice_number,
          purchase_date: data.purchase_date,
          notes: data.notes || undefined,
          items: data.items.map((item) => ({
            medicine: item.medicine,
            quantity: item.quantity,
            unit_price: item.unit_price,
            unit_name: item.unit_name || undefined,
            batch_number: item.batch_number || undefined,
            expiry_date: item.expiry_date || undefined,
            manufacture_date: item.manufacture_date || undefined,
          })),
        })
        notify.success('Purchase received successfully', {
          description: 'Batch stock, expiry, and cost details were recorded.',
        })
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Purchase could not be updated' : 'Purchase receiving failed', {
        fallback: isEditing
          ? 'The purchase changes could not be saved.'
          : 'The purchase was not fully received. Please review batch and stock details.',
        persistent: !isEditing,
      })
    }
  }

  const isLoading = createPurchase.isPending || updatePurchase.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Purchase' : 'Add Purchase'}
      description="Record supplier purchase and stock intake"
      dialogContentClassName="sm:max-w-5xl"
      desktopScrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout className="max-w-none">
          <FormSection title="Purchase Details">
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Supplier" error={errors.supplier?.message}>
                <Select
                  value={watch('supplier')}
                  onValueChange={(value) => setValue('supplier', value, { shouldValidate: true })}
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
              </FormFieldWrapper>

              <FormFieldWrapper label="Invoice Number" error={errors.invoice_number?.message}>
                <Input placeholder="INV-2026-001" {...register('invoice_number')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Purchase Date" error={errors.purchase_date?.message}>
                <Input type="date" {...register('purchase_date')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Notes">
                <Textarea placeholder="Optional notes" {...register('notes')} className="min-h-10" />
              </FormFieldWrapper>
            </div>
          </FormSection>

          {!isEditing && (
            <FormSection title="Items" description="Add quantity and unit cost for each medicine.">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">Enter the purchased unit, lot details, and unit cost. The form shows the resulting base-unit quantity before submission.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => append({ medicine: '', quantity: 1, unit_price: '', unit_name: '', batch_number: '', expiry_date: '', manufacture_date: '' })}
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
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                        <FormFieldWrapper label="Medicine" className="sm:col-span-2 xl:col-span-2" error={errors.items?.[index]?.medicine?.message}>
                          <Select
                            value={watch(`items.${index}.medicine`) || ''}
                            onValueChange={(value) => {
                              setValue(`items.${index}.medicine`, value, { shouldValidate: true })
                              const selected = safeMedicines.find((medicine) => medicine.id === value)
                              if (selected) {
                                const defaultUnit = getPurchaseUnits(selected)[0]?.unit_name ?? selected.base_unit ?? selected.unit
                                const conversion = getUnitConversion(selected, defaultUnit)
                                setValue(`items.${index}.unit_name`, defaultUnit, { shouldValidate: true })
                                setValue(`items.${index}.unit_price`, selected.purchase_price ? String(getUnitPriceFromBase(selected.purchase_price, conversion.factor_to_base_unit)) : '', { shouldValidate: true })
                                setValue(`items.${index}.batch_number`, '', { shouldValidate: true })
                                setValue(`items.${index}.expiry_date`, '', { shouldValidate: true })
                                setValue(`items.${index}.manufacture_date`, '', { shouldValidate: true })
                              }
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
                            value={watch(`items.${index}.unit_name`) || ''}
                            onValueChange={(value) => {
                              setValue(`items.${index}.unit_name`, value, { shouldValidate: true })
                              const selected = safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))
                              if (selected) {
                                const conversion = getUnitConversion(selected, value)
                                setValue(`items.${index}.unit_price`, selected.purchase_price ? String(getUnitPriceFromBase(selected.purchase_price, conversion.factor_to_base_unit)) : '', { shouldValidate: true })
                              }
                            }}
                            disabled={!watch(`items.${index}.medicine`)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {(safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`)) ? getPurchaseUnits(safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))!) : []).map((unit) => (
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

                        <FormFieldWrapper label="Unit Cost" error={errors.items?.[index]?.unit_price?.message}>
                          <Input placeholder="0.00" {...register(`items.${index}.unit_price`)} />
                        </FormFieldWrapper>

                        <FormFieldWrapper label="Batch" error={errors.items?.[index]?.batch_number?.message}>
                          <Input placeholder="Required batch number" {...register(`items.${index}.batch_number`)} />
                        </FormFieldWrapper>

                        <FormFieldWrapper label="Expiry" className="sm:col-span-2 xl:col-span-1" error={errors.items?.[index]?.expiry_date?.message}>
                          <Input type="date" {...register(`items.${index}.expiry_date`)} />
                        </FormFieldWrapper>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <FormFieldWrapper label="Manufacture Date" error={errors.items?.[index]?.manufacture_date?.message}>
                          <Input type="date" {...register(`items.${index}.manufacture_date`)} />
                        </FormFieldWrapper>
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3 text-sm">
                          {(() => {
                            const selectedMedicine = safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))
                            const selectedUnitName = watch(`items.${index}.unit_name`)
                            if (!selectedMedicine || !selectedUnitName) {
                              return 'Select a medicine and purchase unit to see the conversion preview.'
                            }
                            const conversion = getUnitConversion(selectedMedicine, selectedUnitName)
                            return `1 ${selectedUnitName} = ${conversion.factor_to_base_unit} ${selectedMedicine.base_unit}`
                          })()}
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3 text-sm">
                          {(() => {
                            const selectedMedicine = safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))
                            const selectedUnitName = watch(`items.${index}.unit_name`)
                            const quantity = Number(watch(`items.${index}.quantity`) || 0)
                            if (!selectedMedicine || !selectedUnitName) {
                              return 'Base-unit total appears here before receiving.'
                            }
                            const conversion = getUnitConversion(selectedMedicine, selectedUnitName)
                            return `${quantity} ${selectedUnitName} = ${quantity * conversion.factor_to_base_unit} ${selectedMedicine.base_unit}`
                          })()}
                        </div>
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
          )}

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Purchase' : 'Save Purchase'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
