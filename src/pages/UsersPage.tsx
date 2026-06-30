'use client';

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorState } from '@/components/ErrorState'
import { PermissionGuard } from '@/components/PermissionGuard'
import { RoleDetail } from '@/components/roles/RoleDetail'
import { RoleForm } from '@/components/roles/RoleForm'
import { UserForm } from '@/components/users/UserForm'
import { UserDetail } from '@/components/users/UserDetail'
import { useRoles } from '@/hooks/queries/useRoles'
import { useUsers } from '@/hooks/queries/useUsers'
import { useDeleteUser } from '@/hooks/mutations/useUsers'
import { notify } from '@/lib/notify'
import type { RoleDetail as Role, User } from '@/types/auth'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleDetailOpen, setRoleDetailOpen] = useState(false)
  const [roleFormOpen, setRoleFormOpen] = useState(false)

  const { data: users = [], isLoading, isError, refetch } = useUsers({ search })
  const { data: roles = [] } = useRoles()
  const safeUsers = Array.isArray(users) ? users : []
  const safeRoles = Array.isArray(roles) ? roles : []
  const deleteUser = useDeleteUser()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const openRoleDetail = (roleId: number) => {
    const role = safeRoles.find((item) => item.id === roleId)
    if (!role) return
    setSelectedRole(role)
    setRoleDetailOpen(true)
  }

  const openRoleEdit = (roleId: number) => {
    const role = safeRoles.find((item) => item.id === roleId)
    if (!role) return
    setSelectedRole(role)
    setRoleFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteUser.mutateAsync(deleteId)
      notify.success('User deleted successfully')
      setDeleteId(null)
    } catch (error) {
      notify.apiError(error, 'User could not be deleted', {
        fallback: 'The staff account could not be deleted.',
      })
    }
  }

  const columns: Column<User>[] = [
    { key: 'username', header: 'Username', cell: (item) => <span className="font-medium">{item.username}</span> },
    { key: 'email', header: 'Email', cell: (item) => item.email },
    {
      key: 'role',
      header: 'Roles',
      cell: (item) => (
        <div className="flex flex-wrap gap-2">
          {item.roles_detail?.length ? item.roles_detail.map((role) => (
            <div key={role.id} className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium hover:border-primary/50 hover:text-primary"
                onClick={() => openRoleDetail(role.id)}
              >
                {role.name}
              </button>
              <PermissionGuard permission="access.role.update">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openRoleEdit(role.id)}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </PermissionGuard>
            </div>
          )) : <span>-</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[100px]',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <PermissionGuard anyPermissions={['access.user.view']}>
            <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
          </PermissionGuard>
          <PermissionGuard anyPermissions={['access.user.update']}>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
          </PermissionGuard>
          <PermissionGuard anyPermissions={['access.user.delete']}>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
          </PermissionGuard>
        </div>
      ),
    },
  ]

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage staff accounts and access"
        action={
          <PermissionGuard anyPermissions={['access.user.create']}>
            <Button onClick={() => { setSelectedUser(null); setFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </PermissionGuard>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safeUsers}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found"
      />

      <UserForm open={formOpen} onOpenChange={setFormOpen} user={selectedUser} />
      <UserDetail open={detailOpen} onOpenChange={setDetailOpen} user={selectedUser} />
      <RoleDetail
        open={roleDetailOpen}
        onOpenChange={setRoleDetailOpen}
        role={selectedRole}
        onEdit={(role) => {
          setSelectedRole(role)
          setRoleFormOpen(true)
        }}
      />
      <RoleForm open={roleFormOpen} onOpenChange={setRoleFormOpen} role={selectedRole} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteUser.isPending}
      />
    </div>
  )
}
