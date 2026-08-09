'use client';

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipboardList, Loader2, Plus, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { SearchableSelect } from '@/components/forms/SearchableSelect'
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
  batch_number: z.string().optional(),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  manufacture_date: z.string().min(1, 'Manufacture date is required'),
})

const schema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
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
  // Default page size is 20 - this picker needs the whole catalog to search.
  const { data: medicines = [] } = useMedicines({ page_size: '200' })
  const safeMedicines = Array.isArray(medicines) ? medicines : []
  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()
  const isEditing = !!purchase

  const supplierOptions = safeSuppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
    hint: supplier.phone,
  }))

  const medicineOptions = safeMedicines.map((medicine) => ({
    value: medicine.id,
    label: medicine.name,
    hint: [medicine.generic_name, medicine.category_name].filter(Boolean).join(' · '),
  }))

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
        purchase_date: purchase.purchase_date,
        notes: purchase.notes || '',
        items: [],
      })
      return
    }

    reset({
      supplier: '',
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
            purchase_date: data.purchase_date,
            notes: data.notes || undefined,
          },
        })
        notify.success('Purchase updated successfully')
      } else {
        await createPurchase.mutateAsync({
          supplier: data.supplier,
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
          {isEditing && purchase && (
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <span className="text-sm text-muted-foreground">Invoice number</span>
              <span className="font-mono text-sm font-medium">{purchase.invoice_number}</span>
            </div>
          )}

          <FormSection title="Purchase Details" description="Which supplier this stock is coming from and when." icon={Truck}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Supplier" error={errors.supplier?.message} required>
                <SearchableSelect
                  value={watch('supplier')}
                  onValueChange={(value) => setValue('supplier', value, { shouldValidate: true })}
                  options={supplierOptions}
                  placeholder="Select supplier"
                  searchPlaceholder="Search suppliers..."
                  emptyMessage="No suppliers found."
                  disabled={isEditing}
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Purchase Date" error={errors.purchase_date?.message} required>
                <Input type="date" {...register('purchase_date')} />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Notes" helperText="Optional - internal note about this purchase.">
              <Textarea placeholder="e.g. Delivered by courier, invoice attached" {...register('notes')} className="min-h-10" />
            </FormFieldWrapper>
          </FormSection>

          {!isEditing && (
            <FormSection title="Items" description="Add quantity and unit cost for each medicine." icon={ClipboardList}>
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
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const selectedMedicine = safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))
                    const selectedUnitName = watch(`items.${index}.unit_name`)
                    const quantity = Number(watch(`items.${index}.quantity`) || 0)
                    const conversion = selectedMedicine && selectedUnitName ? getUnitConversion(selectedMedicine, selectedUnitName) : null

                    return (
                      <div key={field.id} className="rounded-xl border border-border/60 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item {index + 1}</p>
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <FormFieldWrapper label="Medicine" className="sm:col-span-2" error={errors.items?.[index]?.medicine?.message} required>
                            <SearchableSelect
                              value={watch(`items.${index}.medicine`) || ''}
                              onValueChange={(value) => {
                                setValue(`items.${index}.medicine`, value, { shouldValidate: true })
                                const selected = safeMedicines.find((medicine) => medicine.id === value)
                                if (selected) {
                                  const defaultUnit = getPurchaseUnits(selected)[0]?.unit_name ?? selected.base_unit ?? selected.unit
                                  const unitConversion = getUnitConversion(selected, defaultUnit)
                                  setValue(`items.${index}.unit_name`, defaultUnit, { shouldValidate: true })
                                  setValue(`items.${index}.unit_price`, selected.purchase_price ? String(getUnitPriceFromBase(selected.purchase_price, unitConversion.factor_to_base_unit)) : '', { shouldValidate: true })
                                  setValue(`items.${index}.batch_number`, '', { shouldValidate: true })
                                  setValue(`items.${index}.expiry_date`, '', { shouldValidate: true })
                                  setValue(`items.${index}.manufacture_date`, '', { shouldValidate: true })
                                }
                              }}
                              options={medicineOptions}
                              placeholder="Select medicine"
                              searchPlaceholder="Search medicines..."
                              emptyMessage="No medicines found."
                            />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Purchase Unit">
                            <Select
                              key={`${watch(`items.${index}.medicine`)}-${watch(`items.${index}.unit_name`)}`}
                              value={watch(`items.${index}.unit_name`) || ''}
                              onValueChange={(value) => {
                                setValue(`items.${index}.unit_name`, value, { shouldValidate: true })
                                const selected = safeMedicines.find((medicine) => medicine.id === watch(`items.${index}.medicine`))
                                if (selected) {
                                  const unitConversion = getUnitConversion(selected, value)
                                  setValue(`items.${index}.unit_price`, selected.purchase_price ? String(getUnitPriceFromBase(selected.purchase_price, unitConversion.factor_to_base_unit)) : '', { shouldValidate: true })
                                }
                              }}
                              disabled={!watch(`items.${index}.medicine`)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {(selectedMedicine ? getPurchaseUnits(selectedMedicine) : []).map((unit) => (
                                  <SelectItem key={unit.id} value={unit.unit_name}>
                                    {unit.unit_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Quantity" error={errors.items?.[index]?.quantity?.message} required>
                            <Input type="number" min={1} placeholder="1" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                          </FormFieldWrapper>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <FormFieldWrapper label="Unit Cost" error={errors.items?.[index]?.unit_price?.message} required>
                            <Input placeholder="0.00" {...register(`items.${index}.unit_price`)} />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Batch Number" helperText="Optional - auto-generated if left blank">
                            <Input placeholder="Optional" {...register(`items.${index}.batch_number`)} />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Manufacture Date" error={errors.items?.[index]?.manufacture_date?.message} required>
                            <Input type="date" {...register(`items.${index}.manufacture_date`)} />
                          </FormFieldWrapper>

                          <FormFieldWrapper label="Expiry Date" error={errors.items?.[index]?.expiry_date?.message} required>
                            <Input type="date" {...register(`items.${index}.expiry_date`)} />
                          </FormFieldWrapper>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                            {conversion && selectedMedicine
                              ? `1 ${selectedUnitName} = ${conversion.factor_to_base_unit} ${selectedMedicine.base_unit}`
                              : 'Select a medicine and purchase unit to see the conversion preview.'}
                          </span>
                          <span className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                            {conversion && selectedMedicine
                              ? `${quantity} ${selectedUnitName} = ${quantity * conversion.factor_to_base_unit} ${selectedMedicine.base_unit}`
                              : 'Base-unit total appears here before receiving.'}
                          </span>
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
              {isEditing ? 'Update Purchase' : 'Save Purchase'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
