import { KeyRound, ShieldCheck, UserCircle2, UserCog } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/date'
import type { User, UserAccess } from '@/types/auth'

interface UserDetailContentProps {
  user: User
  access?: UserAccess
}

function DetailTile({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

export function UserDetailContent({ user, access }: UserDetailContentProps) {
  const roles = access?.roles ?? []
  const directPermissions = access?.direct_permissions ?? []
  const inheritedPermissions = access?.inherited_permissions ?? []
  const effectivePermissions = access?.effective_permissions ?? user.permissions ?? []

  return (
    <div className="space-y-6 pb-1">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-sky-50 via-background to-emerald-50 dark:from-sky-950/20 dark:via-background dark:to-emerald-950/15">
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700 dark:text-sky-300">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">
                {roles.length || user.roles_detail?.length || 0} roles
              </Badge>
              <Badge variant="secondary">
                {effectivePermissions.length} effective permissions
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DetailTile label="Staff Access" value={user.is_staff ? 'Staff account' : 'Standard account'} />
            <DetailTile label="Roles Assigned" value={`${roles.length || user.roles_detail?.length || 0}`} />
            <DetailTile label="Direct Permissions" value={`${directPermissions.length || user.direct_permissions_detail?.length || 0}`} />
            <DetailTile label="Created" value={formatDate(user.created_at)} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Role Access</h4>
                <p className="text-sm text-muted-foreground">Roles currently attached to this user</p>
              </div>
            </div>

            {roles.length > 0 || user.roles_detail?.length ? (
              <div className="flex flex-wrap gap-2">
                {(roles.length > 0 ? roles : user.roles_detail || []).map((role) => (
                  <Badge key={role.id} variant="outline" className="px-3 py-1">
                    {role.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
                No roles assigned to this user yet.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTile label="Authorization Version" value={`${user.authorization_version ?? 0}`} />
              <DetailTile label="Inherited Permissions" value={`${inheritedPermissions.length}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Direct Permission Overrides</h4>
                <p className="text-sm text-muted-foreground">Exception-based access granted outside roles</p>
              </div>
            </div>

            {directPermissions.length > 0 || user.direct_permissions_detail?.length ? (
              <div className="flex flex-wrap gap-2">
                {(directPermissions.length > 0 ? directPermissions : user.direct_permissions_detail || []).map((permission) => (
                  <Badge key={permission.id} variant="secondary" className="px-3 py-1">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
                No direct permission overrides assigned.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/70 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">Effective Permissions</h4>
              <p className="text-sm text-muted-foreground">What this user can actually do in the system right now</p>
            </div>
          </div>

          {effectivePermissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {effectivePermissions.map((permission) => (
                <Badge key={permission} variant="outline" className="px-3 py-1">
                  {permission}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
              This user does not currently have any effective permissions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
