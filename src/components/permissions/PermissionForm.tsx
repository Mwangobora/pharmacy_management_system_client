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
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreatePermission, useUpdatePermission } from '@/hooks/mutations/usePermissions'
import type { PermissionDetail } from '@/types/auth'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  codename: z.string().min(1, 'Codename is required'),
  content_type: z.coerce.number().min(1, 'Content type ID is required'),
})

type FormData = z.input<typeof schema>

interface PermissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: PermissionDetail | null
}

export function PermissionForm({ open, onOpenChange, permission }: PermissionFormProps) {
  const createPermission = useCreatePermission()
  const updatePermission = useUpdatePermission()
  const isEditing = !!permission

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      codename: '',
      content_type: 0,
    },
  })

  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name,
        codename: permission.codename,
        content_type: permission.content_type,
      })
    } else {
      reset({ name: '', codename: '', content_type: 0 })
    }
  }, [permission, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updatePermission.mutateAsync({ id: permission.id, payload: data })
        toast.success('Permission updated successfully')
      } else {
        await createPermission.mutateAsync(data)
        toast.success('Permission created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update permission' : 'Failed to create permission')
    }
  }

  const isLoading = createPermission.isPending || updatePermission.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Permission' : 'Add Permission'}
      description="Create or update permissions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="codename">Codename</Label>
          <Input id="codename" {...register('codename')} />
          {errors.codename && <p className="text-sm text-destructive">{errors.codename.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="content_type">Content Type ID</Label>
          <Input id="content_type" type="number" {...register('content_type')} />
          {errors.content_type && <p className="text-sm text-destructive">{errors.content_type.message}</p>}
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
