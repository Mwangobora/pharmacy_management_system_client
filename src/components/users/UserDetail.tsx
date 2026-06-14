import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import type { User } from '@/types/auth'

interface UserDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserDetail({ open, onOpenChange, user }: UserDetailProps) {
  if (!user) return null

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="User Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Roles</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {user.roles_detail?.length ? user.roles_detail.map((role) => (
                <Badge key={role.id} variant="outline">{role.name}</Badge>
              )) : <span>-</span>}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={user.is_active ? 'default' : 'secondary'}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Staff</p>
            <p>{user.is_staff ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(user.created_at), 'PPP')}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Effective Permissions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.permissions?.length ? user.permissions.map((permission) => (
              <Badge key={permission} variant="outline">{permission}</Badge>
            )) : <span className="text-sm text-muted-foreground">No permissions assigned</span>}
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
