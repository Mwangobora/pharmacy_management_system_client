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
import { RoleForm } from '@/components/roles/RoleForm'
import { RoleDetail } from '@/components/roles/RoleDetail'
import { useRoles } from '@/hooks/queries/useRoles'
import { useDeleteRole } from '@/hooks/mutations/useRoles'
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
      toast.success('Role deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete role')
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
          <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
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
          <Button onClick={() => { setSelectedRole(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
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
      />

      <RoleForm open={formOpen} onOpenChange={setFormOpen} role={selectedRole} />
      <RoleDetail open={detailOpen} onOpenChange={setDetailOpen} role={selectedRole} />
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
