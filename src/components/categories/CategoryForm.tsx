'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LayoutGrid, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateCategory, useUpdateCategory } from '@/hooks/mutations/useCategories'
import { notify } from '@/lib/notify'
import type { Category } from '@/types/inventory'

const schema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  description: z.string().optional(),
  display_order: z.coerce.number().min(0, 'Display order cannot be negative').default(0),
  is_active: z.boolean().default(true),
})

type FormData = z.input<typeof schema>

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryForm({ open, onOpenChange, category }: CategoryFormProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isEditing = !!category

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
    defaultValues: { name: '', description: '', display_order: 0, is_active: true },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        display_order: category.display_order,
        is_active: category.is_active,
      })
      return
    }

    reset({ name: '', description: '', display_order: 0, is_active: true })
  }, [category, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateCategory.mutateAsync({
          id: category.id,
          payload: {
            name: data.name,
            description: data.description,
            display_order: Number(data.display_order),
            is_active: data.is_active,
          },
        })
        notify.success('Category updated successfully')
      } else {
        await createCategory.mutateAsync({
          name: data.name,
          description: data.description,
          display_order: Number(data.display_order),
          is_active: data.is_active,
        })
        notify.success('Category created successfully')
      }
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, isEditing ? 'Category could not be updated' : 'Category could not be created', {
        fallback: isEditing
          ? 'The category changes could not be saved.'
          : 'The category could not be created.',
      })
    }
  }

  const isLoading = createCategory.isPending || updateCategory.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Category' : 'Add Category'}
      description="Create or update product categories"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Category Details" description="Used to group medicines in the catalog and reports." icon={LayoutGrid}>
            <FormFieldWrapper label="Category Name" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" placeholder="e.g. Analgesics & Antipyretics" {...register('name')} />
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="description" error={errors.description?.message} helperText="Optional - shown to staff when choosing a category.">
              <Textarea id="description" placeholder="e.g. Pain and fever relief medicines" {...register('description')} />
            </FormFieldWrapper>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Display Order" htmlFor="display_order" error={errors.display_order?.message} helperText="Lower numbers appear first in lists.">
                <Input id="display_order" type="number" min={0} placeholder="0" {...register('display_order')} />
              </FormFieldWrapper>

              <div className="flex items-center justify-between self-end rounded-lg border border-border/60 bg-background px-3 py-2.5">
                <span className="text-sm font-medium">Active Category</span>
                <Switch
                  id="is_active"
                  checked={watch('is_active')}
                  onCheckedChange={(value) => setValue('is_active', value, { shouldValidate: true })}
                />
              </div>
            </div>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Category' : 'Create Category'}
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
