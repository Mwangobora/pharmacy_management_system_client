'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCategories } from '@/hooks/queries/useCategories'
import { useCreateMedicine, useUpdateMedicine } from '@/hooks/mutations/useMedicines'
import type { Medicine, MedicineUnit } from '@/types/inventory'

const units: MedicineUnit[] = ['pieces', 'tablets', 'capsules', 'bottles', 'boxes', 'strips', 'vials', 'tubes', 'sachets']

const schema = z.object({
  name: z.string().min(1, 'Required'),
  generic_name: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
  supplier: z.string().min(1, 'Required'),
  batch_number: z.string().min(1, 'Required'),
  manufacture_date: z.string().min(1, 'Required'),
  expiry_date: z.string().min(1, 'Required'),
  purchase_price: z.string().min(1, 'Required'),
  selling_price: z.string().min(1, 'Required'),
  stock_quantity: z.coerce.number().min(0),
  min_stock_level: z.coerce.number().min(0),
  max_stock_level: z.coerce.number().min(0),
  unit: z.string().min(1, 'Required'),
  storage_location: z.string().optional(),
  barcode: z.string().optional(),
  requires_prescription: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

interface MedicineFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
}

export function MedicineForm({ open, onOpenChange, medicine }: MedicineFormProps) {
  const { data: categories = [] } = useCategories()
  const createMedicine = useCreateMedicine()
  const updateMedicine = useUpdateMedicine()
  const isEditing = !!medicine

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stock_quantity: 0, min_stock_level: 10, max_stock_level: 100, requires_prescription: false, is_active: true },
  })

  useEffect(() => {
    if (medicine) {
      reset({ ...medicine, unit: medicine.unit as string })
    } else {
      reset({ name: '', generic_name: '', category: '', supplier: '', batch_number: '', manufacture_date: '', expiry_date: '', purchase_price: '', selling_price: '', stock_quantity: 0, min_stock_level: 10, max_stock_level: 100, unit: 'pieces', requires_prescription: false, is_active: true })
    }
  }, [medicine, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) { await updateMedicine.mutateAsync({ id: medicine.id, payload: data as any }); toast.success('Medicine updated') }
      else { await createMedicine.mutateAsync(data as any); toast.success('Medicine created') }
      onOpenChange(false)
    } catch { toast.error('Failed to save medicine') }
  }

  const isLoading = createMedicine.isPending || updateMedicine.isPending

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={isEditing ? 'Edit Medicine' : 'Add Medicine'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Name</Label><Input {...register('name')} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
          <div className="space-y-2"><Label>Generic Name</Label><Input {...register('generic_name')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Category</Label>
            <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Supplier ID</Label><Input {...register('supplier')} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Batch Number</Label><Input {...register('batch_number')} /></div>
          <div className="space-y-2"><Label>Manufacture Date</Label><Input type="date" {...register('manufacture_date')} /></div>
          <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" {...register('expiry_date')} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Purchase Price</Label><Input {...register('purchase_price')} /></div>
          <div className="space-y-2"><Label>Selling Price</Label><Input {...register('selling_price')} /></div>
          <div className="space-y-2"><Label>Unit</Label>
            <Select value={watch('unit')} onValueChange={(v) => setValue('unit', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Stock Qty</Label><Input type="number" {...register('stock_quantity')} /></div>
          <div className="space-y-2"><Label>Min Stock</Label><Input type="number" {...register('min_stock_level')} /></div>
          <div className="space-y-2"><Label>Max Stock</Label><Input type="number" {...register('max_stock_level')} /></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Switch id="prescription" checked={watch('requires_prescription')} onCheckedChange={(v) => setValue('requires_prescription', v)} /><Label htmlFor="prescription">Requires Prescription</Label></div>
          <div className="flex items-center gap-2"><Switch id="active" checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} /><Label htmlFor="active">Active</Label></div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEditing ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
