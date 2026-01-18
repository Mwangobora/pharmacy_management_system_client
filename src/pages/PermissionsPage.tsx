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
import { PermissionForm } from '@/components/permissions/PermissionForm'
import { PermissionDetail } from '@/components/permissions/PermissionDetail'
import { usePermissions } from '@/hooks/queries/usePermissions'
import { useDeletePermission } from '@/hooks/mutations/usePermissions'
import type { PermissionDetail as Permission } from '@/types/auth'

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: permissions = [], isLoading, isError, refetch } = usePermissions()
  const safePermissions = Array.isArray(permissions) ? permissions : []
  const filteredPermissions = safePermissions.filter((permission) =>
    permission.name.toLowerCase().includes(search.toLowerCase()) ||
    permission.codename.toLowerCase().includes(search.toLowerCase())
  )
  const deletePermission = useDeletePermission()

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormOpen(true)
  }

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    try {
      await deletePermission.mutateAsync(deleteId)
      toast.success('Permission deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete permission')
    }
  }

  const columns: Column<Permission>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'codename', header: 'Codename', cell: (item) => item.codename },
    {
      key: 'content_type',
      header: 'Content Type',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{item.content_type_label}</Badge>
          <span className="text-xs text-muted-foreground">{item.content_type_model}</span>
        </div>
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
        title="Permissions"
        description="Control feature-level access"
        action={
          <Button onClick={() => { setSelectedPermission(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Permission
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search permissions..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPermissions}
        isLoading={isLoading}
        keyExtractor={(item) => String(item.id)}
        emptyMessage="No permissions found"
      />

      <PermissionForm open={formOpen} onOpenChange={setFormOpen} permission={selectedPermission} />
      <PermissionDetail open={detailOpen} onOpenChange={setDetailOpen} permission={selectedPermission} />
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Permission"
        description="Are you sure you want to delete this permission? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deletePermission.isPending}
      />
    </div>
  )
}
