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
import { RoleForm } from '@/components/roles/RoleForm'
import { RoleDetail } from '@/components/roles/RoleDetail'
import { useRoles } from '@/hooks/queries/useRoles'
import { useDeleteRole } from '@/hooks/mutations/useRoles'
import { notify } from '@/lib/notify'
import type { RoleDetail as Role } from '@/types/auth'

export default function RolesPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: roles = [], isLoading, isError, refetch } = useRoles()
  const safeRoles = Array.isArray(roles) ? roles : []
  const filteredRoles = safeRoles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  )
  const deleteRole = useDeleteRole()

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setFormOpen(true)
  }

  const handleView = (role: Role) => {
    setSelectedRole(role)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    try {
      await deleteRole.mutateAsync(deleteId)
      notify.success('Role deleted successfully')
      setDeleteId(null)
    } catch (error) {
      notify.apiError(error, 'Role could not be deleted', {
        fallback: 'The role could not be deleted.',
      })
    }
  }

  const columns: Column<Role>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'permissions', header: 'Permissions', cell: (item) => item.permissions_detail.length },
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
          <PermissionGuard permission="access.role.view"><Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button></PermissionGuard>
          <PermissionGuard permission="access.role.update"><Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button></PermissionGuard>
          <PermissionGuard permission="access.role.delete"><Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button></PermissionGuard>
        </div>
      ),
    },
  ]

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Define access roles for staff"
        action={
          <PermissionGuard permission="access.role.create">
            <Button onClick={() => { setSelectedRole(null); setFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </PermissionGuard>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search roles..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRoles}
        isLoading={isLoading}
        keyExtractor={(item) => String(item.id)}
        emptyMessage="No roles found"
        onRowClick={handleView}
      />

      <RoleForm open={formOpen} onOpenChange={setFormOpen} role={selectedRole} />
      <RoleDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        role={selectedRole}
        onEdit={(role) => {
          setSelectedRole(role)
          setFormOpen(true)
        }}
        onDelete={(role) => setDeleteId(role.id)}
      />
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteRole.isPending}
      />
    </div>
  )
}
