'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { KeyRound, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreatePermission, useUpdatePermission } from '@/hooks/mutations/usePermissions'
import { notify } from '@/lib/notify'
import type { PermissionDetail } from '@/types/auth'

const schema = z.object({
  name: z.string().trim().min(1, 'Permission name is required'),
  codename: z.string().trim().min(1, 'Permission key is required'),
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
    },
  })

  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name,
        codename: permission.codename,
      })
      return
    }

    reset({ name: '', codename: '' })
  }, [permission, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updatePermission.mutateAsync({
          id: permission.id,
          payload: {
            name: data.name,
            codename: data.codename,
          },
        })
        notify.success('Permission updated successfully')
      } else {
        await createPermission.mutateAsync({
          name: data.name,
          codename: data.codename,
        })
        notify.success('Permission created successfully')
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Permission could not be updated' : 'Permission could not be created', {
        fallback: isEditing
          ? 'The permission changes could not be saved.'
          : 'The permission could not be created.',
      })
    }
  }

  const isLoading = createPermission.isPending || updatePermission.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Permission' : 'Add Permission'}
      description="Define an access right that can be assigned to staff roles."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Permission Details" description="A single access right that can be granted to a role." icon={KeyRound}>
            <FormFieldWrapper
              label="Permission Name"
              htmlFor="name"
              error={errors.name?.message}
              helperText="What staff will see when assigning this to a role."
              required
            >
              <Input id="name" placeholder="e.g. View Sales" {...register('name')} />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Permission Key"
              htmlFor="codename"
              error={errors.codename?.message}
              helperText="A unique internal code, e.g. sales.sale.view - lowercase, no spaces."
              required
            >
              <Input id="codename" placeholder="e.g. sales.sale.view" {...register('codename')} />
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
