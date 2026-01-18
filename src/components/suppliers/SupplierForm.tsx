'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/mutations/useSuppliers'
import type { Supplier } from '@/types/suppliers'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_person: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  is_active: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

interface SupplierFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
}

export function SupplierForm({ open, onOpenChange, supplier }: SupplierFormProps) {
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const isEditing = !!supplier

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      tax_id: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contact_person: supplier.contact_person || '',
        phone: supplier.phone,
        email: supplier.email || '',
        address: supplier.address || '',
        tax_id: supplier.tax_id || '',
        is_active: supplier.is_active,
      })
    } else {
      reset({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        tax_id: '',
        is_active: true,
      })
    }
  }, [supplier, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateSupplier.mutateAsync({ id: supplier.id, payload: data })
        toast.success('Supplier updated successfully')
      } else {
        await createSupplier.mutateAsync(data)
        toast.success('Supplier created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update supplier' : 'Failed to create supplier')
    }
  }

  const isLoading = createSupplier.isPending || updateSupplier.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Supplier' : 'Add Supplier'}
      description="Fill in the supplier details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input id="contact_person" {...register('contact_person')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input id="tax_id" {...register('tax_id')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" {...register('address')} />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="is_active"
            checked={watch('is_active')}
            onCheckedChange={(v) => setValue('is_active', v)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
