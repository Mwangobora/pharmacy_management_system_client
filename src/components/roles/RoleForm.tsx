'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateRole, useUpdateRole } from '@/hooks/mutations/useRoles'
import { usePermissions } from '@/hooks/queries/usePermissions'
import type { RoleDetail } from '@/types/auth'

const schema = z.object({
  name: z.string().trim().min(1, 'Role name is required'),
  permissions: z.array(z.number()).default([]),
  is_active: z.boolean().default(true),
})

type FormData = z.input<typeof schema>

interface RoleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleDetail | null
}

export function RoleForm({ open, onOpenChange, role }: RoleFormProps) {
  const { data: permissions = [] } = usePermissions()
  const safePermissions = Array.isArray(permissions) ? permissions : []
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const isEditing = !!role

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
      permissions: [],
      is_active: true,
    },
  })

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissions: role.permissions || [],
        is_active: role.is_active,
      })
      return
    }

    reset({ name: '', permissions: [], is_active: true })
  }, [role, reset])

  const selectedPermissions = watch('permissions') || []

  const togglePermission = (permissionId: number) => {
    const next = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId]
    setValue('permissions', next, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateRole.mutateAsync({ id: role.id, payload: data })
        toast.success('Role updated successfully')
      } else {
        await createRole.mutateAsync({ ...data, permissions: data.permissions ?? [] })
        toast.success('Role created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update role' : 'Failed to create role')
    }
  }

  const isLoading = createRole.isPending || updateRole.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Role' : 'Add Role'}
      description="Create or update roles and permissions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Role Profile">
            <FormFieldWrapper label="Role Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" placeholder="Pharmacist" {...register('name')} />
            </FormFieldWrapper>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="text-sm font-medium">Active Role</span>
              <Switch
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(value) => setValue('is_active', value, { shouldValidate: true })}
              />
            </div>
          </FormSection>

          <FormSection title="Permissions" description="Select access rights for this role.">
            <FormFieldWrapper
              label="Permission List"
              helperText="Use only required permissions to keep access minimal."
            >
              <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-border/60 p-3">
                {safePermissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No permissions available.</p>
                ) : (
                  safePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-muted/50">
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                        className="mt-0.5"
                      />
                      <span className="min-w-0">
                        <span className="block font-medium text-foreground">{permission.name}</span>
                        <span className="block text-xs text-muted-foreground">{permission.codename}</span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </FormFieldWrapper>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Role' : 'Create Role'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
