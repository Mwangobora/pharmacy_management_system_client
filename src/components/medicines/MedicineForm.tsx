'use client';

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Boxes, Layers, Loader2, Pill, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { SearchableSelect } from '@/components/forms/SearchableSelect'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCategories } from '@/hooks/queries/useCategories'
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useCreateMedicine, useUpdateMedicine } from '@/hooks/mutations/useMedicines'
import { notify } from '@/lib/notify'
import type { Medicine, MedicineCreatePayload, MedicineUnit, MedicineUnitConversionPayload } from '@/types/inventory'

const DOSAGE_FORMS = [
  { value: 'tablet', label: 'Tablet', suggestedUnit: 'tablets' },
  { value: 'capsule', label: 'Capsule', suggestedUnit: 'capsules' },
  { value: 'syrup', label: 'Syrup', suggestedUnit: 'bottles' },
  { value: 'suspension', label: 'Suspension', suggestedUnit: 'bottles' },
  { value: 'injection', label: 'Injection', suggestedUnit: 'vials' },
  { value: 'ampoule', label: 'Ampoule', suggestedUnit: 'vials' },
  { value: 'cream', label: 'Cream', suggestedUnit: 'tubes' },
  { value: 'ointment', label: 'Ointment', suggestedUnit: 'tubes' },
  { value: 'sachet_powder', label: 'Sachet Powder', suggestedUnit: 'sachets' },
] as const

const MEDICINE_UNITS: { value: MedicineUnit; label: string }[] = [
  { value: 'pieces', label: 'Pieces' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'capsules', label: 'Capsules' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'strips', label: 'Strips' },
  { value: 'vials', label: 'Vials' },
  { value: 'tubes', label: 'Tubes' },
  { value: 'sachets', label: 'Sachets' },
] 

const conversionSchema = z.object({
  unit_name: z.string().min(1, 'Unit name is required'),
  factor_to_base_unit: z.coerce.number().int().min(1, 'Factor must be at least 1'),
  allow_purchase: z.boolean().default(true),
  allow_sale: z.boolean().default(true),
})

const schema = z.object({
  name: z.string().trim().min(1, 'Medicine name is required'),
  generic_name: z.string().trim().optional(),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  dosage_form: z.string().optional(),
  base_unit: z.string().min(1, 'Base unit is required'),
  selling_price: z.string().trim().min(1, 'Selling price is required'),
  min_stock_level: z.coerce.number().min(0, 'Minimum stock must be 0 or higher').default(10),
  max_stock_level: z.coerce.number().min(1, 'Maximum stock must be at least 1').default(1000),
  storage_location: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  unit_conversions: z.array(conversionSchema).default([]),
}).superRefine((data, ctx) => {
  const seen = new Set<string>()
  for (const conversion of data.unit_conversions) {
    if (conversion.unit_name === data.base_unit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['unit_conversions'],
        message: 'Package conversions must be different from the selected base unit.',
      })
    }
    if (seen.has(conversion.unit_name)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['unit_conversions'],
        message: `Duplicate conversion "${conversion.unit_name}" is not allowed.`,
      })
    }
    seen.add(conversion.unit_name)
  }
  if (data.max_stock_level < data.min_stock_level) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['max_stock_level'],
      message: 'Maximum stock must be greater than or equal to minimum stock.',
    })
  }
})

type FormData = z.input<typeof schema>

interface MedicineFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
}

function toOptionalString(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function normalizeConversions(conversions: MedicineUnitConversionPayload[] | undefined) {
  return (conversions || []).map((item) => ({
    unit_name: item.unit_name,
    factor_to_base_unit: item.factor_to_base_unit,
    allow_purchase: item.allow_purchase ?? true,
    allow_sale: item.allow_sale ?? true,
  }))
}

export function MedicineForm({ open, onOpenChange, medicine }: MedicineFormProps) {
  const { data: categories = [] } = useCategories()
  const { data: suppliers = [] } = useSuppliers()
  const createMedicine = useCreateMedicine()
  const updateMedicine = useUpdateMedicine()
  const isEditing = !!medicine

  const defaultValues: FormData = {
    name: '',
    generic_name: '',
    category: '',
    supplier: '',
    dosage_form: '',
    base_unit: '',
    selling_price: '',
    min_stock_level: 10,
    max_stock_level: 1000,
    storage_location: '',
    barcode: '',
    unit_conversions: [],
  }

  const mapMedicineToForm = (value?: Medicine | null): FormData => {
    if (!value) return defaultValues
    return {
      name: value.name,
      generic_name: value.generic_name || '',
      category: value.category,
      supplier: value.supplier,
      dosage_form: '',
      base_unit: value.base_unit,
      selling_price: value.selling_price || '',
      min_stock_level: value.min_stock_level,
      max_stock_level: value.max_stock_level,
      storage_location: value.storage_location || '',
      barcode: value.barcode || '',
      unit_conversions: normalizeConversions(
        (value.unit_conversions || []).filter((item) => !item.is_base_unit)
      ),
    }
  }

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
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'unit_conversions',
  })

  useEffect(() => {
    reset(mapMedicineToForm(medicine))
  }, [medicine, open, reset])

  const selectedDosageForm = watch('dosage_form')
  const suggestedUnit = DOSAGE_FORMS.find((item) => item.value === selectedDosageForm)?.suggestedUnit

  useEffect(() => {
    if (!suggestedUnit || isEditing) return
    const currentBaseUnit = watch('base_unit')
    if (!currentBaseUnit || currentBaseUnit === defaultValues.base_unit) {
      setValue('base_unit', suggestedUnit as MedicineUnit, { shouldValidate: true })
    }
  }, [defaultValues.base_unit, isEditing, setValue, suggestedUnit, watch])

  const onSubmit = async (data: FormData) => {
    const payload: MedicineCreatePayload = {
      name: data.name.trim(),
      generic_name: toOptionalString(data.generic_name),
      category: data.category,
      supplier: data.supplier,
      base_unit: data.base_unit as MedicineUnit,
      selling_price: data.selling_price.trim(),
      min_stock_level: Number(data.min_stock_level),
      max_stock_level: Number(data.max_stock_level),
      storage_location: toOptionalString(data.storage_location),
      barcode: toOptionalString(data.barcode),
      unit_conversions: (data.unit_conversions || []).map((item, index) => ({
        unit_name: item.unit_name,
        factor_to_base_unit: Number(item.factor_to_base_unit),
        allow_purchase: item.allow_purchase,
        allow_sale: item.allow_sale,
        sort_order: index + 1,
      })),
    }

    try {
      if (isEditing && medicine) {
        await updateMedicine.mutateAsync({ id: medicine.id, payload })
        notify.success('Medicine updated successfully')
      } else {
        await createMedicine.mutateAsync(payload)
        notify.success('Medicine created successfully', {
          description: 'You can receive batch stock for this medicine during purchase receiving.',
        })
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Medicine could not be updated' : 'Medicine could not be created', {
        fallback: isEditing
          ? 'The medicine changes could not be saved.'
          : 'The medicine could not be created.',
      })
    }
  }

  const isLoading = createMedicine.isPending || updateMedicine.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Medicine' : 'Add Medicine'}
      description="Create a product master first. Batch, cost, manufacture, expiry, and stock are entered during purchase receiving."
      dialogContentClassName="sm:max-w-5xl"
      desktopScrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout className="max-w-none space-y-4">
          <FormSection title="Product Master" description="The core identity of this medicine in the catalog." icon={Pill}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Medicine Name" error={errors.name?.message} required>
                <Input placeholder="e.g. Paracetamol 500mg Tablets" {...register('name')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Generic Name" error={errors.generic_name?.message} helperText="Optional - the active ingredient.">
                <Input placeholder="e.g. Paracetamol" {...register('generic_name')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Dosage Form" helperText="Optional - suggests a base unit.">
                <Select value={watch('dosage_form') || ''} onValueChange={(value) => setValue('dosage_form', value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOSAGE_FORMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper label="Base Unit" error={errors.base_unit?.message} required>
                <Select value={watch('base_unit') || ''} onValueChange={(value) => setValue('base_unit', value as MedicineUnit, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Confirm base unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICINE_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Category" error={errors.category?.message} required>
                <SearchableSelect
                  value={watch('category')}
                  onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
                  options={(Array.isArray(categories) ? categories : []).map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  placeholder="Select category"
                  searchPlaceholder="Search categories..."
                  emptyMessage="No categories found."
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Supplier" error={errors.supplier?.message} required>
                <SearchableSelect
                  value={watch('supplier')}
                  onValueChange={(value) => setValue('supplier', value, { shouldValidate: true })}
                  options={(Array.isArray(suppliers) ? suppliers : []).map((supplier) => ({
                    value: supplier.id,
                    label: supplier.name,
                    hint: supplier.phone,
                  }))}
                  placeholder="Select supplier"
                  searchPlaceholder="Search suppliers..."
                  emptyMessage="No suppliers found."
                />
              </FormFieldWrapper>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm">
              <p className="font-medium">Unit confirmation</p>
              <p className="mt-1 text-muted-foreground">
                {suggestedUnit
                  ? `Suggested from dosage form: ${suggestedUnit}. Review the base unit and confirm it before saving.`
                  : 'Choose the true stock-counting base unit. Package units like box or strip should go into conversions below.'}
              </p>
            </div>
          </FormSection>

          <FormSection title="Selling & Reorder" description="Pricing and the stock thresholds that trigger low-stock alerts." icon={Boxes}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FormFieldWrapper label="Selling Price" error={errors.selling_price?.message} required>
                <Input placeholder="e.g. 500.00" {...register('selling_price')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Minimum Stock" error={errors.min_stock_level?.message} helperText="Low-stock alert threshold.">
                <Input type="number" min={0} {...register('min_stock_level', { valueAsNumber: true })} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Maximum Stock" error={errors.max_stock_level?.message}>
                <Input type="number" min={1} {...register('max_stock_level', { valueAsNumber: true })} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Storage Location" error={errors.storage_location?.message} helperText="Optional - shelf or bin code.">
                <Input placeholder="e.g. Shelf A3" {...register('storage_location')} />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Barcode" error={errors.barcode?.message} helperText="Optional - for barcode-scanner checkout.">
              <Input placeholder="e.g. 6009123456789" {...register('barcode')} />
            </FormFieldWrapper>
          </FormSection>

          <FormSection title="Package Conversions" description="Optional package units for purchasing and selling. Example: 1 strip = 10 tablets." icon={Layers}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Base unit stays in the medicine master. Package units convert into that base unit.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ unit_name: '', factor_to_base_unit: 1, allow_purchase: true, allow_sale: true })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Conversion
              </Button>
            </div>

            {errors.unit_conversions?.message ? (
              <p className="text-sm text-destructive">{errors.unit_conversions.message}</p>
            ) : null}

            {fields.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No package conversions added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border border-border/60 p-3">
                    <div className="grid gap-3 md:grid-cols-5">
                      <FormFieldWrapper label="Package Unit" error={errors.unit_conversions?.[index]?.unit_name?.message}>
                        <Select
                          value={watch(`unit_conversions.${index}.unit_name`) || ''}
                          onValueChange={(value) => setValue(`unit_conversions.${index}.unit_name`, value, { shouldValidate: true })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEDICINE_UNITS.filter((unit) => unit.value !== watch('base_unit')).map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormFieldWrapper>

                      <FormFieldWrapper
                        label="Units Per Package"
                        error={errors.unit_conversions?.[index]?.factor_to_base_unit?.message}
                        helperText={`How many ${String(watch('base_unit') || 'base units')} are in one package`}
                      >
                        <Input type="number" min={1} {...register(`unit_conversions.${index}.factor_to_base_unit`, { valueAsNumber: true })} />
                      </FormFieldWrapper>

                      <FormFieldWrapper label="Purchase Allowed">
                        <Select
                          value={watch(`unit_conversions.${index}.allow_purchase`) ? 'yes' : 'no'}
                          onValueChange={(value) => setValue(`unit_conversions.${index}.allow_purchase`, value === 'yes', { shouldValidate: true })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormFieldWrapper>

                      <FormFieldWrapper label="Sale Allowed">
                        <Select
                          value={watch(`unit_conversions.${index}.allow_sale`) ? 'yes' : 'no'}
                          onValueChange={(value) => setValue(`unit_conversions.${index}.allow_sale`, value === 'yes', { shouldValidate: true })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormFieldWrapper>

                      <div className="flex items-end justify-between gap-3">
                        <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                          1 {String(watch(`unit_conversions.${index}.unit_name`) || 'package')} = {Number(watch(`unit_conversions.${index}.factor_to_base_unit`) || 0)} {String(watch('base_unit') || '')}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Medicine' : 'Create Medicine'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
