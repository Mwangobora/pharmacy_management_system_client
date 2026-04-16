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
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { useCreateUser, useUpdateUser } from '@/hooks/mutations/useUsers'
import { useRoles } from '@/hooks/queries/useRoles'
import type { User } from '@/types/auth'

const schema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().optional(),
  role: z.string().optional(),
})

type FormData = z.input<typeof schema>

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserForm({ open, onOpenChange, user }: UserFormProps) {
  const { data: roles = [] } = useRoles()
  const safeRoles = Array.isArray(roles) ? roles : []
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isEditing = !!user

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
      username: '',
      email: '',
      password: '',
      role: '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role ? String(user.role) : '',
      })
      return
    }

    reset({ username: '', email: '', password: '', role: '' })
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const roleValue = data.role ? Number(data.role) : undefined
      if (isEditing) {
        await updateUser.mutateAsync({
          id: user.id,
          payload: {
            username: data.username,
            email: data.email,
            role: roleValue,
          },
        })
        toast.success('User updated successfully')
      } else {
        if (!data.password) {
          toast.error('Password is required')
          return
        }

        await createUser.mutateAsync({
          username: data.username,
          email: data.email,
          password: data.password,
          role: roleValue,
        })
        toast.success('User created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update user' : 'Failed to create user')
    }
  }

  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit User' : 'Add User'}
      description="Create or update user accounts"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Account Details">
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Username"
                htmlFor="username"
                error={errors.username?.message}
              >
                <Input id="username" placeholder="john.doe" {...register('username')} />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Email"
                htmlFor="email"
                error={errors.email?.message}
              >
                <Input id="email" type="email" placeholder="name@company.com" {...register('email')} />
              </FormFieldWrapper>
            </div>

            {!isEditing && (
              <FormFieldWrapper
                label="Password"
                htmlFor="password"
                helperText="Use at least 8 characters."
                error={errors.password?.message}
              >
                <Input id="password" type="password" placeholder="Secure password" {...register('password')} />
              </FormFieldWrapper>
            )}

            <FormFieldWrapper label="Role" error={errors.role?.message}>
              <Select
                value={watch('role') || 'none'}
                onValueChange={(value) => setValue('role', value === 'none' ? '' : value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No role</SelectItem>
                  {safeRoles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
