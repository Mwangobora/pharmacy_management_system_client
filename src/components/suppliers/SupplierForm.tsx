'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Loader2, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/mutations/useSuppliers'
import { notify } from '@/lib/notify'
import type { Supplier } from '@/types/suppliers'

const schema = z.object({
  name: z.string().trim().min(1, 'Supplier name is required'),
  contact_person: z.string().optional(),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  is_active: z.boolean().default(true),
})

type FormData = z.input<typeof schema>

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
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
      return
    }

    reset({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      tax_id: '',
      is_active: true,
    })
  }, [supplier, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateSupplier.mutateAsync({
          id: supplier.id,
          payload: {
            name: data.name,
            contact_person: data.contact_person,
            phone: data.phone,
            email: data.email,
            address: data.address,
            tax_id: data.tax_id,
            is_active: data.is_active,
          },
        })
        notify.success('Supplier updated successfully')
      } else {
        await createSupplier.mutateAsync({
          name: data.name,
          contact_person: data.contact_person,
          phone: data.phone,
          email: data.email,
          address: data.address,
          tax_id: data.tax_id,
          is_active: data.is_active,
        })
        notify.success('Supplier created successfully')
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Supplier could not be updated' : 'Supplier could not be created', {
        fallback: isEditing
          ? 'The supplier changes could not be saved.'
          : 'The supplier could not be created.',
      })
    }
  }

  const isLoading = createSupplier.isPending || updateSupplier.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Supplier' : 'Add Supplier'}
      description="Create or update supplier records"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Company Details" description="The vendor's registered business identity." icon={Building2}>
            <FormFieldWrapper label="Supplier Name" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" placeholder="e.g. Shelys Pharmaceuticals Ltd" {...register('name')} />
            </FormFieldWrapper>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Tax ID (TIN)" htmlFor="tax_id" error={errors.tax_id?.message} helperText="Optional - for invoicing and compliance records.">
                <Input id="tax_id" placeholder="e.g. 109-334-882" {...register('tax_id')} />
              </FormFieldWrapper>

              <div className="flex items-center justify-between self-end rounded-lg border border-border/60 bg-background px-3 py-2.5">
                <span className="text-sm font-medium">Active Supplier</span>
                <Switch
                  id="is_active"
                  checked={watch('is_active')}
                  onCheckedChange={(value) => setValue('is_active', value, { shouldValidate: true })}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Contact Information" description="How your team reaches this supplier." icon={Phone}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Contact Person" htmlFor="contact_person" error={errors.contact_person?.message} helperText="The person who handles your orders.">
                <Input id="contact_person" placeholder="e.g. Grace Mmbaga" {...register('contact_person')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Phone Number" htmlFor="phone" error={errors.phone?.message} required>
                <Input id="phone" placeholder="e.g. +255 712 345 678" {...register('phone')} />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Email Address" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" placeholder="e.g. orders@supplier.co.tz" {...register('email')} />
            </FormFieldWrapper>
          </FormSection>

          <FormSection title="Address" icon={MapPin}>
            <FormFieldWrapper label="Business Address" htmlFor="address" error={errors.address?.message} helperText="Street, ward, and city - used for delivery and correspondence.">
              <Textarea id="address" placeholder="e.g. Nyerere Road, Vingunguti, Dar es Salaam" {...register('address')} />
            </FormFieldWrapper>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Supplier' : 'Create Supplier'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
