import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { Category } from '@/types/inventory'

interface CategoryDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryDetail({ open, onOpenChange, category }: CategoryDetailProps) {
  if (!category) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Category Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{category.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Code</p>
            <Badge variant="outline">{category.code}</Badge>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{category.description || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Display Order</p>
            <p>{category.display_order}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Medicine Count</p>
            <p>{category.medicine_count}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={category.is_active ? 'default' : 'secondary'}>
              {category.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(category.created_at), 'PPP')}</p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
