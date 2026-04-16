'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCategories } from '@/hooks/queries/useCategories'
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useCreateMedicine, useUpdateMedicine } from '@/hooks/mutations/useMedicines'
import type { Medicine, MedicineCreatePayload } from '@/types/inventory'

const schema = z
  .object({
    name: z.string().trim().min(1, 'Medicine name is required'),
    generic_name: z.string().trim().optional(),
    category: z.string().min(1, 'Category is required'),
    supplier: z.string().min(1, 'Supplier is required'),
    expiry_date: z.string().min(1, 'Expiry date is required'),
    selling_price: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (!data.expiry_date) return true
      const today = new Date()
      const expiry = new Date(`${data.expiry_date}T00:00:00`)
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      return expiry >= todayMidnight
    },
    { message: 'Expiry date must be today or later', path: ['expiry_date'] },
  )

type FormData = z.input<typeof schema>

interface MedicineFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
}

export function MedicineForm({ open, onOpenChange, medicine }: MedicineFormProps) {
  const { data: categories = [] } = useCategories()
  const safeCategories = Array.isArray(categories) ? categories : []
  const { data: suppliers = [] } = useSuppliers()
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : []
  const createMedicine = useCreateMedicine()
  const updateMedicine = useUpdateMedicine()
  const isEditing = !!medicine

  const defaultValues: FormData = {
    name: '',
    generic_name: '',
    category: '',
    supplier: '',
    expiry_date: '',
    selling_price: '',
  }

  const mapMedicineToForm = (value?: Medicine | null): FormData => {
    if (!value) return defaultValues

    return {
      name: value.name,
      generic_name: value.generic_name || '',
      category: value.category,
      supplier: value.supplier,
      expiry_date: value.expiry_date,
      selling_price: value.selling_price || '',
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues,
  })

  useEffect(() => {
    reset(mapMedicineToForm(medicine))
  }, [medicine, reset, open])

  const toOptionalString = (value?: string) => {
    if (!value) return undefined
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }

  const onSubmit = async (data: FormData) => {
    const payload: MedicineCreatePayload = {
      name: data.name.trim(),
      category: data.category,
      supplier: data.supplier,
      expiry_date: data.expiry_date,
      generic_name: toOptionalString(data.generic_name),
      selling_price: toOptionalString(data.selling_price),
    }

    try {
      if (isEditing) {
        await updateMedicine.mutateAsync({ id: medicine.id, payload })
        toast.success('Medicine updated successfully')
      } else {
        await createMedicine.mutateAsync(payload)
        toast.success('Medicine created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error('Failed to save medicine')
    }
  }

  const isLoading = createMedicine.isPending || updateMedicine.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Medicine' : 'Add Medicine'}
      description="Fill in medicine details"
      dialogContentClassName="sm:max-w-4xl"
      desktopScrollable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout className="max-w-none space-y-4">
          <FormSection title="Medicine Details">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <FormFieldWrapper label="Medicine Name" error={errors.name?.message} className="xl:col-span-2">
                <Input placeholder="Paracetamol" {...register('name')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Generic Name" error={errors.generic_name?.message} className="xl:col-span-2">
                <Input placeholder="Optional" {...register('generic_name')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Expiry Date" error={errors.expiry_date?.message}>
                <Input type="date" min={new Date().toISOString().split('T')[0]} {...register('expiry_date')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Selling Price" error={errors.selling_price?.message}>
                <Input placeholder="Default selling price" {...register('selling_price')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Category" error={errors.category?.message}>
                <Select
                  value={watch('category')}
                  onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {safeCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper label="Supplier" error={errors.supplier?.message}>
                <Select
                  value={watch('supplier')}
                  onValueChange={(value) => setValue('supplier', value, { shouldValidate: true })}
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
            </div>
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
