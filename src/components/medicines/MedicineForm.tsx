'use client';

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormActions, FormFieldWrapper, FormLayout } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCategories } from '@/hooks/queries/useCategories'
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useCreateMedicine, useUpdateMedicine } from '@/hooks/mutations/useMedicines'
import type { Medicine, MedicineUnit } from '@/types/inventory'

const units: MedicineUnit[] = ['pieces', 'tablets', 'capsules', 'bottles', 'boxes', 'strips', 'vials', 'tubes', 'sachets']

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  generic_name: z.string().trim().min(1, 'Generic name is required'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  batch_number: z.string().trim().min(1, 'Batch number is required'),
  manufacture_date: z.string().min(1, 'Manufacture date is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  purchase_price: z.string().min(1, 'Purchase price is required'),
  selling_price: z.string().min(1, 'Selling price is required'),
  stock_quantity: z.coerce.number().min(0, 'Cannot be negative'),
  min_stock_level: z.coerce.number().min(0, 'Cannot be negative'),
  max_stock_level: z.coerce.number().min(0, 'Cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  storage_location: z.string().optional(),
  barcode: z.string().optional(),
  requires_prescription: z.boolean().default(false),
  is_active: z.boolean().default(true),
}).refine(
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

type TabKey = 'identity' | 'supply' | 'pricing' | 'inventory'

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
  const [activeTab, setActiveTab] = useState<TabKey>('identity')

  const defaultValues: FormData = {
    name: '',
    generic_name: '',
    category: '',
    supplier: '',
    batch_number: '',
    manufacture_date: '',
    expiry_date: '',
    purchase_price: '',
    selling_price: '',
    stock_quantity: 0,
    min_stock_level: 10,
    max_stock_level: 100,
    unit: 'pieces',
    storage_location: '',
    barcode: '',
    requires_prescription: false,
    is_active: true,
  }

  const mapMedicineToForm = (value?: Medicine | null): FormData => {
    if (!value) return defaultValues
    return {
      ...defaultValues,
      ...value,
      unit: value.unit as string,
      storage_location: value.storage_location ?? '',
      barcode: value.barcode ?? '',
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
    setActiveTab('identity')
  }, [medicine, reset, open])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateMedicine.mutateAsync({ id: medicine.id, payload: data as never })
        toast.success('Medicine updated successfully')
      } else {
        await createMedicine.mutateAsync(data as never)
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
      description="Wide desktop form with tabbed sections"
      dialogContentClassName="sm:max-w-6xl"
      desktopScrollable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout className="max-w-none space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="gap-4">
            <TabsList className="grid h-10 w-full min-w-0 grid-cols-2 gap-1 rounded-lg bg-muted/70 p-1 md:grid-cols-4">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="supply">Supply</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" forceMount className="space-y-4 data-[state=inactive]:hidden">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormFieldWrapper label="Medicine Name" error={errors.name?.message}>
                  <Input placeholder="Paracetamol" {...register('name')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Generic Name" error={errors.generic_name?.message}>
                  <Input placeholder="Acetaminophen" {...register('generic_name')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Category" error={errors.category?.message}>
                  <Select value={watch('category')} onValueChange={(value) => setValue('category', value, { shouldValidate: true })}>
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
                  <Select value={watch('supplier')} onValueChange={(value) => setValue('supplier', value, { shouldValidate: true })}>
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
            </TabsContent>

            <TabsContent value="supply" forceMount className="space-y-4 data-[state=inactive]:hidden">
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                <FormFieldWrapper label="Batch Number" error={errors.batch_number?.message}>
                  <Input placeholder="BATCH-001" {...register('batch_number')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Manufacture Date" error={errors.manufacture_date?.message}>
                  <Input type="date" {...register('manufacture_date')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Expiry Date" error={errors.expiry_date?.message}>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} {...register('expiry_date')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Storage Location" error={errors.storage_location?.message}>
                  <Input placeholder="Shelf A2" {...register('storage_location')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Barcode" error={errors.barcode?.message}>
                  <Input placeholder="Optional barcode" {...register('barcode')} />
                </FormFieldWrapper>
              </div>
            </TabsContent>

            <TabsContent value="pricing" forceMount className="space-y-4 data-[state=inactive]:hidden">
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <FormFieldWrapper label="Purchase Price" error={errors.purchase_price?.message}>
                  <Input placeholder="0.00" {...register('purchase_price')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Selling Price" error={errors.selling_price?.message}>
                  <Input placeholder="0.00" {...register('selling_price')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Unit" error={errors.unit?.message}>
                  <Select value={watch('unit')} onValueChange={(value) => setValue('unit', value, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
                <div className="grid gap-3 md:col-span-3 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
                  <div className="flex h-10 items-center justify-between rounded-lg border border-border/60 px-3">
                    <span className="text-sm font-medium">Prescription</span>
                    <Switch
                      checked={watch('requires_prescription')}
                      onCheckedChange={(value) => setValue('requires_prescription', value, { shouldValidate: true })}
                    />
                  </div>
                  <div className="flex h-10 items-center justify-between rounded-lg border border-border/60 px-3">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={watch('is_active')}
                      onCheckedChange={(value) => setValue('is_active', value, { shouldValidate: true })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" forceMount className="space-y-4 data-[state=inactive]:hidden">
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                <FormFieldWrapper label="Stock Quantity" error={errors.stock_quantity?.message}>
                  <Input type="number" min={0} placeholder="0" {...register('stock_quantity')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Min Stock" error={errors.min_stock_level?.message}>
                  <Input type="number" min={0} placeholder="10" {...register('min_stock_level')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Max Stock" error={errors.max_stock_level?.message}>
                  <Input type="number" min={0} placeholder="100" {...register('max_stock_level')} />
                </FormFieldWrapper>
              </div>
            </TabsContent>
          </Tabs>

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
