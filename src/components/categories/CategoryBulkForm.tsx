'use client';

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Layers, Loader2, Plus, Trash2 } from 'lucide-react'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
import { useBulkCreateCategories } from '@/hooks/mutations/useCategories'
import { notify } from '@/lib/notify'

const rowSchema = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

const schema = z.object({
  rows: z.array(rowSchema),
})

type FormData = z.input<typeof schema>

const emptyRow = { name: '', description: '' }

interface CategoryBulkFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryBulkForm({ open, onOpenChange }: CategoryBulkFormProps) {
  const bulkCreate = useBulkCreateCategories()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rows: [emptyRow, emptyRow, emptyRow] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' })

  const onSubmit = async (data: FormData) => {
    const rows = data.rows.filter((row) => row.name?.trim())
    if (rows.length === 0) {
      notify.warning('Add at least one category', {
        description: 'Enter a name for at least one row before saving.',
      })
      return
    }

    try {
      await bulkCreate.mutateAsync(
        rows.map((row, index) => ({
          name: row.name!.trim(),
          description: row.description || undefined,
          display_order: index,
        })),
      )
      notify.success('Categories added successfully')
      reset({ rows: [emptyRow, emptyRow, emptyRow] })
      onOpenChange(false)
    } catch (error) {
      notify.apiError(error, 'Categories could not be added', {
        fallback: 'The categories could not be saved.',
      })
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Multiple Categories"
      description="Quickly create several categories at once."
      dialogContentClassName="sm:max-w-2xl"
      desktopScrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormLayout>
          <FormSection title="Categories" description="Leave the description blank if you don't need one." icon={Layers}>
            {errors.rows?.message && <p className="text-xs font-medium text-destructive">{errors.rows.message}</p>}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3">
                  <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <FormFieldWrapper label="Category Name" error={errors.rows?.[index]?.name?.message} required>
                      <Input placeholder="e.g. Antimalarials" {...register(`rows.${index}.name`)} />
                    </FormFieldWrapper>
                    <FormFieldWrapper label="Description">
                      <Input placeholder="e.g. Malaria prevention and treatment" {...register(`rows.${index}.description`)} />
                    </FormFieldWrapper>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-5 shrink-0"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={() => append(emptyRow)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Row
            </Button>
          </FormSection>

          <FormActions>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={bulkCreate.isPending}>
              {bulkCreate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Categories
            </Button>
          </FormActions>
        </FormLayout>
      </form>
    </ResponsiveModal>
  )
}
