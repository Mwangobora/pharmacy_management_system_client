import { Edit, KeyRound, ShieldCheck, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { DetailHero } from '@/components/detail/DetailHero'
import type { DetailMetricItem } from '@/components/detail/types'
import type { RoleDetail as RoleDetailType } from '@/types/auth'

interface RoleDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: RoleDetailType | null
  onEdit?: (role: RoleDetailType) => void
  onDelete?: (role: RoleDetailType) => void
}

export function RoleDetail({ open, onOpenChange, role, onEdit, onDelete }: RoleDetailProps) {
  if (!role) return null

  const permissionsByModule = role.permissions_detail.reduce<Record<string, typeof role.permissions_detail>>(
    (groups, permission) => {
      const key = permission.module || 'General'
      groups[key] = groups[key] ? [...groups[key], permission] : [permission]
      return groups
    },
    {},
  )

  const metrics: DetailMetricItem[] = [
    {
      icon: KeyRound,
      label: 'Permissions',
      value: `${role.permissions_detail.length}`,
      hint: 'Access rights assigned to this role',
    },
    {
      icon: Users,
      label: 'Staff Assigned',
      value: role.user_count !== undefined ? `${role.user_count}` : '-',
      hint: 'Users currently in this role',
    },
  ]

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Role Details"
      description="Review what this role can access across the system."
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
                onDelete(role)
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
                onEdit(role)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Role
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6 pb-1">
        <DetailHero
          icon={ShieldCheck}
          title={role.name}
          subtitle={role.description || 'No description provided'}
          metrics={metrics}
          gradientClassName="from-indigo-50 via-background to-sky-50 dark:from-indigo-950/30 dark:via-background dark:to-sky-950/20"
          iconClassName="bg-indigo-600/10 text-indigo-700 dark:text-indigo-300"
          badges={[
            { label: role.is_active ? 'Active' : 'Inactive', variant: role.is_active ? 'default' : 'secondary' },
            { label: role.code, variant: 'outline' },
          ]}
        />

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Assigned Permissions</h4>
                <p className="text-sm text-muted-foreground">Grouped by area of the system</p>
              </div>
            </div>

            {role.permissions_detail.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No permissions assigned to this role yet.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(permissionsByModule).map(([module, permissions]) => (
                  <div key={module} className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {module}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <Badge key={permission.id} variant="outline" title={permission.description}>
                          {permission.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveModal>
  )
}
