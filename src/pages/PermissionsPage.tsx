'use client';

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ErrorState } from '@/components/ErrorState'
import { PermissionDetail } from '@/components/permissions/PermissionDetail'
import { usePermissions } from '@/hooks/queries/usePermissions'
import type { PermissionDetail as Permission } from '@/types/auth'

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data: permissions = [], isLoading, isError, refetch } = usePermissions()
  const safePermissions = Array.isArray(permissions) ? permissions : []
  const filteredPermissions = safePermissions.filter((permission) =>
    permission.name.toLowerCase().includes(search.toLowerCase()) ||
    permission.codename.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission)
    setDetailOpen(true)
  }

  const columns: Column<Permission>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'codename', header: 'Codename', cell: (item) => item.codename },
    {
      key: 'module',
      header: 'Module',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{item.module || '-'}</Badge>
          <span className="text-xs text-muted-foreground">{[item.resource, item.action].filter(Boolean).join(' · ')}</span>
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
        </div>
      ),
    },
  ]

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions"
        description="Review registered system permissions"
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
      <PermissionDetail open={detailOpen} onOpenChange={setDetailOpen} permission={selectedPermission} />
    </div>
  )
}
