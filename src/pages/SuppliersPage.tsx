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
import { SupplierForm } from '@/components/suppliers/SupplierForm'
import { SupplierDetail } from '@/components/suppliers/SupplierDetail'
import { useSuppliers } from '@/hooks/queries/useSuppliers'
import { useDeleteSupplier } from '@/hooks/mutations/useSuppliers'
import type { Supplier } from '@/types/suppliers'

export default function SuppliersPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: suppliers = [], isLoading, isError, refetch } = useSuppliers({ search })
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : []
  const deleteSupplier = useDeleteSupplier()

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setFormOpen(true)
  }

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSupplier.mutateAsync(deleteId)
      toast.success('Supplier deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete supplier')
    }
  }

  const columns: Column<Supplier>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'contact', header: 'Contact', cell: (item) => item.contact_person || '-' },
    { key: 'phone', header: 'Phone', cell: (item) => item.phone },
    { key: 'email', header: 'Email', cell: (item) => item.email || '-' },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'medicines', header: 'Medicines', cell: (item) => item.active_medicines_count },
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
        title="Suppliers"
        description="Manage vendor and supplier records"
        action={
          <Button onClick={() => { setSelectedSupplier(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search suppliers..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safeSuppliers}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No suppliers found"
      />

      <SupplierForm open={formOpen} onOpenChange={setFormOpen} supplier={selectedSupplier} />
      <SupplierDetail open={detailOpen} onOpenChange={setDetailOpen} supplier={selectedSupplier} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteSupplier.isPending}
      />
    </div>
  )
}
