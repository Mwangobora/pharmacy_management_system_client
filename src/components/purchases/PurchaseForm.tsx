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
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useCreatePurchase, useUpdatePurchase } from '@/hooks/mutations/usePurchases'
import type { Purchase } from '@/types/suppliers'

const itemSchema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.string().min(1, 'Unit price is required'),
  discount_percent: z.string().optional(),
  tax_percent: z.string().optional(),
})

const schema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  invoice_number: z.string().trim().min(1, 'Invoice number is required'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  tax_amount: z.string().optional(),
  discount_amount: z.string().optional(),
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
      return
    }

    reset({
      supplier: '',
      invoice_number: '',
      purchase_date: '',
      tax_amount: '',
      discount_amount: '',
      notes: '',
      items: [],
    })
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
          items: data.items,
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
      description="Fill in purchase details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
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

              <FormFieldWrapper label="Invoice Number" htmlFor="invoice_number" error={errors.invoice_number?.message}>
                <Input id="invoice_number" placeholder="INV-2026-001" {...register('invoice_number')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormFieldWrapper label="Purchase Date" htmlFor="purchase_date" error={errors.purchase_date?.message}>
                <Input id="purchase_date" type="date" {...register('purchase_date')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Tax Amount" htmlFor="tax_amount">
                <Input id="tax_amount" placeholder="0.00" {...register('tax_amount')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Discount Amount" htmlFor="discount_amount">
                <Input id="discount_amount" placeholder="0.00" {...register('discount_amount')} />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Notes" htmlFor="notes">
              <Textarea id="notes" placeholder="Optional purchase notes" {...register('notes')} />
            </FormFieldWrapper>
          </FormSection>

          {!isEditing && (
            <FormSection title="Purchase Items" description="Add one or more medicines to this purchase.">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Line items drive stock updates on submit.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ medicine: '', quantity: 1, unit_price: '', discount_percent: '', tax_percent: '' })}
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
                                setValue(`items.${index}.unit_price`, String(selected.purchase_price), { shouldValidate: true })
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
                          <Input placeholder="0.00" {...register(`items.${index}.unit_price`)} />
                        </FormFieldWrapper>

                        <FormFieldWrapper label="Discount %">
                          <Input placeholder="0" {...register(`items.${index}.discount_percent`)} />
                        </FormFieldWrapper>

                        <FormFieldWrapper label="Tax %">
                          <Input placeholder="0" {...register(`items.${index}.tax_percent`)} />
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
          )}

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Purchase' : 'Create Purchase'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
