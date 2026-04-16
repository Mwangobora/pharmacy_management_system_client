'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { Label } from '@/components/ui/label'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/mutations/useCustomers'
import type { Customer } from '@/types/sales'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.coerce.number().optional(),
  gender: z.enum(['M', 'F', 'Other']),
})

type FormData = z.input<typeof schema>

interface CustomerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

export function CustomerForm({ open, onOpenChange, customer }: CustomerFormProps) {
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const isEditing = !!customer

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
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      date_of_birth: '',
      age: undefined,
      gender: 'M',
    },
  })

  useEffect(() => {
    if (customer) {
      const ageValue = customer.date_of_birth
        ? Math.max(0, new Date().getFullYear() - new Date(customer.date_of_birth).getFullYear())
        : undefined
      reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || '',
        date_of_birth: customer.date_of_birth || '',
        age: ageValue,
        gender: customer.gender,
      })
      return
    }

    reset({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      date_of_birth: '',
      age: undefined,
      gender: 'M',
    })
  }, [customer, reset])

  const onSubmit = async (data: FormData) => {
    const payload = { ...data }
    if (typeof payload.age === 'number' && Number.isFinite(payload.age)) {
      const today = new Date()
      const year = Math.max(0, today.getFullYear() - payload.age)
      payload.date_of_birth = `${year}-01-01`
    }
    delete payload.age

    try {
      if (isEditing) {
        await updateCustomer.mutateAsync({ id: customer.id, payload })
        toast.success('Customer updated successfully')
      } else {
        await createCustomer.mutateAsync(payload)
        toast.success('Customer created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update customer' : 'Failed to create customer')
    }
  }

  const isLoading = createCustomer.isPending || updateCustomer.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Customer' : 'Add Customer'}
      description="Create or update customer records"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Customer Information">
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="First Name" htmlFor="first_name" error={errors.first_name?.message}>
                <Input id="first_name" placeholder="John" {...register('first_name')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Last Name" htmlFor="last_name" error={errors.last_name?.message}>
                <Input id="last_name" placeholder="Doe" {...register('last_name')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Phone" htmlFor="phone" error={errors.phone?.message}>
                <Input id="phone" placeholder="+255712345678" {...register('phone')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" placeholder="name@domain.com" {...register('email')} />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Age" htmlFor="age" helperText="Optional. Used to infer birth year.">
                <Input id="age" type="number" min={0} placeholder="30" {...register('age')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Gender" error={errors.gender?.message}>
                <RadioGroup
                  value={watch('gender')}
                  onValueChange={(value) => setValue('gender', value as FormData['gender'], { shouldValidate: true })}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm"
                    >
                      <RadioGroupItem value={option.value} />
                      <Label className="cursor-pointer font-normal">{option.label}</Label>
                    </label>
                  ))}
                </RadioGroup>
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Address" htmlFor="address">
              <Textarea id="address" placeholder="Street, city, region" {...register('address')} />
            </FormFieldWrapper>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Customer' : 'Create Customer'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
