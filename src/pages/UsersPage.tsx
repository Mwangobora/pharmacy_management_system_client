'use client';

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorState } from '@/components/ErrorState'
import { PermissionGuard } from '@/components/PermissionGuard'
import { UserForm } from '@/components/users/UserForm'
import { UserDetail } from '@/components/users/UserDetail'
import { useUsers } from '@/hooks/queries/useUsers'
import { useDeleteUser } from '@/hooks/mutations/useUsers'
import type { User } from '@/types/auth'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: users = [], isLoading, isError, refetch } = useUsers({ search })
  const safeUsers = Array.isArray(users) ? users : []
  const deleteUser = useDeleteUser()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteUser.mutateAsync(deleteId)
      toast.success('User deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const columns: Column<User>[] = [
    { key: 'username', header: 'Username', cell: (item) => <span className="font-medium">{item.username}</span> },
    { key: 'email', header: 'Email', cell: (item) => item.email },
    { key: 'role', header: 'Role', cell: (item) => item.role_name || '-' },
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
          <PermissionGuard anyPermissions={['view_user']}>
            <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
          </PermissionGuard>
          <PermissionGuard anyPermissions={['change_user']}>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
          </PermissionGuard>
          <PermissionGuard anyPermissions={['delete_user']}>
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
          <PermissionGuard anyPermissions={['add_user']}>
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
