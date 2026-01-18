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
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerDetail } from '@/components/customers/CustomerDetail'
import { useCustomers } from '@/hooks/queries/useCustomers'
import { useDeleteCustomer } from '@/hooks/mutations/useCustomers'
import type { Customer } from '@/types/sales'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: customers = [], isLoading, isError, refetch } = useCustomers({ search })
  const safeCustomers = Array.isArray(customers) ? customers : []
  const deleteCustomer = useDeleteCustomer()

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormOpen(true)
  }

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCustomer.mutateAsync(deleteId)
      toast.success('Customer deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete customer')
    }
  }

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.full_name}</span> },
    { key: 'phone', header: 'Phone', cell: (item) => item.phone },
    { key: 'email', header: 'Email', cell: (item) => item.email || '-' },
    {
      key: 'gender',
      header: 'Gender',
      cell: (item) => <Badge variant="outline">{item.gender}</Badge>,
    },
    { key: 'loyalty', header: 'Loyalty', cell: (item) => item.loyalty_points },
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
        title="Customers"
        description="Manage customer profiles and loyalty points"
        action={
          <Button onClick={() => { setSelectedCustomer(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safeCustomers}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No customers found"
      />

      <CustomerForm open={formOpen} onOpenChange={setFormOpen} customer={selectedCustomer} />
      <CustomerDetail open={detailOpen} onOpenChange={setDetailOpen} customer={selectedCustomer} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteCustomer.isPending}
      />
    </div>
  )
}
