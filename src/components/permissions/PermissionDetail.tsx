import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { PermissionDetail as PermissionDetailType } from '@/types/auth'

interface PermissionDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: PermissionDetailType | null
}

export function PermissionDetail({ open, onOpenChange, permission }: PermissionDetailProps) {
  if (!permission) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Permission Details">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{permission.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Codename</p>
          <p>{permission.codename}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Module</p>
            <Badge variant="outline">{permission.module || '-'}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resource</p>
            <Badge variant="secondary">{permission.resource || '-'}</Badge>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Action</p>
          <p>{permission.action || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{permission.description || '-'}</p>
        </div>
      </div>
    </ResponsiveModal>
  )
}
