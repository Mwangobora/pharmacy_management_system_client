'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateCategory, useUpdateCategory } from '@/hooks/mutations/useCategories'
import type { Category } from '@/types/inventory'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  display_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

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
    } else {
      reset({ name: '', description: '', display_order: 0, is_active: true })
    }
  }, [category, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: category.id, payload: data })
        toast.success('Category updated successfully')
      } else {
        await createCategory.mutateAsync(data)
        toast.success('Category created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update category' : 'Failed to create category')
    }
  }

  const isLoading = createCategory.isPending || updateCategory.isPending

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={isEditing ? 'Edit Category' : 'Add Category'} description="Fill in the category details">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" type="number" {...register('display_order')} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_active" checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEditing ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
