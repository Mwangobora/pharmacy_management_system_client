'use client';

import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { SearchableSelectionField } from '@/components/forms/SearchableSelectionField'
import { useCreateUser, useUpdateUser } from '@/hooks/mutations/useUsers'
import { usePermissions } from '@/hooks/queries/usePermissions'
import { useRoles } from '@/hooks/queries/useRoles'
import { notify } from '@/lib/notify'
import type { User } from '@/types/auth'

const schema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().optional(),
  roles: z.array(z.number()).default([]),
  direct_permissions: z.array(z.number()).default([]),
})

type FormData = z.input<typeof schema>

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserForm({ open, onOpenChange, user }: UserFormProps) {
  const { data: roles = [] } = useRoles()
  const { data: permissions = [] } = usePermissions()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isEditing = !!user

  const { register, handleSubmit, reset, setValue, control, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '', roles: [], direct_permissions: [] },
  })

  useEffect(() => {
    reset({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      roles: user?.roles_detail?.map((role) => role.id) || (user?.role ? [user.role] : []),
      direct_permissions: user?.direct_permissions_detail?.map((permission) => permission.id) || [],
    })
  }, [user, reset])

  const selectedRoles = useWatch({ control, name: 'roles' }) || []
  const selectedPermissions = useWatch({ control, name: 'direct_permissions' }) || []
  const roleItems = useMemo(
    () => roles.map((role) => ({
      id: role.id,
      label: role.name,
      hint: role.code,
      description: role.description,
      searchText: [role.name, role.code, role.description].filter(Boolean).join(' '),
    })),
    [roles],
  )
  const permissionItems = useMemo(
    () => permissions.map((permission) => ({
      id: permission.id,
      label: permission.name,
      hint: permission.codename,
      description: permission.description,
      searchText: [
        permission.name,
        permission.codename,
        permission.module,
        permission.resource,
        permission.action,
        permission.description,
      ].filter(Boolean).join(' '),
    })),
    [permissions],
  )

  const toggle = (field: 'roles' | 'direct_permissions', id: number) => {
    const current = getValues(field) || []
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    setValue(field, next, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        roles: data.roles,
        direct_permissions: data.direct_permissions,
      }

      if (isEditing) {
        await updateUser.mutateAsync({ id: user.id, payload })
        notify.success('User updated successfully')
      } else {
        if (!data.password) {
          return notify.warning('Password is required', {
            description: 'Enter a password before creating a new user account.',
          })
        }
        await createUser.mutateAsync({ ...payload, password: data.password })
        notify.success('User created successfully')
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'User could not be updated' : 'User could not be created', {
        fallback: isEditing
          ? 'The staff account changes could not be saved.'
          : 'The staff account could not be created.',
      })
    }
  }

  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={isEditing ? 'Edit User' : 'Add User'} description="Create or update user accounts and access.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Account Details">
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Username" error={errors.username?.message}>
                <Input placeholder="john.doe" {...register('username')} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Email" error={errors.email?.message}>
                <Input type="email" placeholder="name@company.com" {...register('email')} />
              </FormFieldWrapper>
            </div>
            {!isEditing && (
              <FormFieldWrapper label="Password" error={errors.password?.message} helperText="Use at least 8 characters.">
                <Input type="password" placeholder="Secure password" {...register('password')} />
              </FormFieldWrapper>
            )}
          </FormSection>

          <FormSection title="Role Assignments">
            <SearchableSelectionField
              title="Assign one or more roles"
              items={roleItems}
              selected={selectedRoles}
              onToggle={(id) => toggle('roles', id)}
              searchPlaceholder="Search roles..."
              emptyMessage="No roles available."
              noResultsMessage="No roles match your search."
            />
          </FormSection>

          <FormSection title="Direct Permissions" description="Use sparingly for exception-based access overrides.">
            <SearchableSelectionField
              title="Optional direct permissions"
              items={permissionItems}
              selected={selectedPermissions}
              onToggle={(id) => toggle('direct_permissions', id)}
              searchPlaceholder="Search permissions..."
              emptyMessage="No permissions available."
              noResultsMessage="No permissions match your search."
            />
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
