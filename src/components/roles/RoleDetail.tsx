import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { RoleDetail as RoleDetailType } from '@/types/auth'

interface RoleDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleDetailType | null
  onEdit?: (role: RoleDetailType) => void
}

export function RoleDetail({ open, onOpenChange, role, onEdit }: RoleDetailProps) {
  if (!role) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Role Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{role.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Code</p>
            <p>{role.code}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{role.description || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={role.is_active ? 'default' : 'secondary'}>
              {role.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Permissions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {role.permissions_detail.length === 0 ? (
              <span className="text-sm text-muted-foreground">No permissions</span>
            ) : (
              role.permissions_detail.map((permission) => (
                <Badge key={permission.id} variant="outline">
                  {permission.codename}
                </Badge>
              ))
            )}
          </div>
        </div>
        {onEdit && (
          <div className="flex justify-end border-t border-border/60 pt-4">
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit(role)
              }}
            >
              Edit Role
            </Button>
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}
