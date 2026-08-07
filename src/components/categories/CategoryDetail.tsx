import { format } from 'date-fns'
import { Edit, Pill, Tags, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { DetailHero } from '@/components/detail/DetailHero'
import { DetailInfoCard } from '@/components/detail/DetailInfoCard'
import type { DetailMetricItem } from '@/components/detail/types'
import type { Category } from '@/types/inventory'

interface CategoryDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
}

export function CategoryDetail({ open, onOpenChange, category, onEdit, onDelete }: CategoryDetailProps) {
  if (!category) return null

  const metrics: DetailMetricItem[] = [
    {
      icon: Pill,
      label: 'Medicines',
      value: `${category.medicine_count}`,
      hint: category.medicine_count === 1 ? 'Medicine in this category' : 'Medicines in this category',
    },
    {
      icon: Tags,
      label: 'Display Order',
      value: `${category.display_order}`,
      hint: 'Position shown in category lists',
    },
  ]

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Category Details"
      description="Review how this category is used across the medicine catalog."
      dialogContentClassName="sm:max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onOpenChange(false)
                onDelete(category)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit(category)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6 pb-1">
        <DetailHero
          icon={Tags}
          title={category.name}
          subtitle={category.description || 'No description provided'}
          metrics={metrics}
          gradientClassName="from-violet-50 via-background to-sky-50 dark:from-violet-950/30 dark:via-background dark:to-sky-950/20"
          iconClassName="bg-violet-600/10 text-violet-700 dark:text-violet-300"
          badges={[
            { label: category.is_active ? 'Active' : 'Inactive', variant: category.is_active ? 'default' : 'secondary' },
            { label: category.code, variant: 'outline' },
          ]}
        />

        <DetailInfoCard
          title="Category Reference"
          description="Details used when assigning medicines to this category"
          icon={Tags}
          items={[
            { label: 'Category Code', value: category.code },
            { label: 'Created On', value: format(new Date(category.created_at), 'PPP') },
          ]}
        />
      </div>
    </ResponsiveModal>
  )
}
