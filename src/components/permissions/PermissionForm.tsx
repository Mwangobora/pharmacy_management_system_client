'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreatePermission, useUpdatePermission } from '@/hooks/mutations/usePermissions'
import type { PermissionDetail } from '@/types/auth'

const schema = z.object({
  name: z.string().trim().min(1, 'Permission name is required'),
  codename: z.string().trim().min(1, 'Codename is required'),
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
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
      return
    }

    reset({ name: '', codename: '', content_type: 0 })
  }, [permission, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updatePermission.mutateAsync({
          id: permission.id,
          payload: {
            name: data.name,
            codename: data.codename,
            content_type: Number(data.content_type),
          },
        })
        toast.success('Permission updated successfully')
      } else {
        await createPermission.mutateAsync({
          name: data.name,
          codename: data.codename,
          content_type: Number(data.content_type),
        })
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
      description="Create or update system permissions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Permission Details">
            <FormFieldWrapper label="Permission Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" placeholder="View Sales" {...register('name')} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Codename" htmlFor="codename" error={errors.codename?.message}>
              <Input id="codename" placeholder="view_sale" {...register('codename')} />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Content Type ID"
              htmlFor="content_type"
              error={errors.content_type?.message}
              helperText="Use the target model content type numeric ID."
            >
              <Input id="content_type" type="number" min={1} placeholder="1" {...register('content_type')} />
            </FormFieldWrapper>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Permission' : 'Create Permission'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
