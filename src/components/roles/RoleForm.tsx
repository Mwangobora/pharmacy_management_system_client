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
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateRole, useUpdateRole } from '@/hooks/mutations/useRoles'
import { usePermissions } from '@/hooks/queries/usePermissions'
import type { RoleDetail } from '@/types/auth'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
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
    } else {
      reset({ name: '', permissions: [], is_active: true })
    }
  }, [role, reset])

  const selectedPermissions = watch('permissions')

  const togglePermission = (permissionId: number) => {
    const next = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId]
    setValue('permissions', next)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateRole.mutateAsync({ id: role.id, payload: data })
        toast.success('Role updated successfully')
      } else {
        await createRole.mutateAsync(data)
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
        <div className="space-y-2">
          <Label htmlFor="name">Role Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Permissions</Label>
          <div className="max-h-52 space-y-2 overflow-auto rounded-md border p-3">
            {safePermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No permissions available.</p>
            ) : (
              safePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="h-4 w-4"
                  />
                  <span>{permission.name}</span>
                  <span className="text-muted-foreground">({permission.codename})</span>
                </label>
              ))
            )}
          </div>
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
