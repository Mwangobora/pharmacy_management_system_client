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
import { SaleForm } from '@/components/sales/SaleForm'
import { SaleDetail } from '@/components/sales/SaleDetail'
import { useSales } from '@/hooks/queries/useSales'
import { useDeleteSale } from '@/hooks/mutations/useSales'
import type { Sale } from '@/types/sales'

export default function SalesPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: sales = [], isLoading, isError, refetch } = useSales({ search })
  const safeSales = Array.isArray(sales) ? sales : []
  const deleteSale = useDeleteSale()

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale)
    setFormOpen(true)
  }

  const handleView = (sale: Sale) => {
    setSelectedSale(sale)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSale.mutateAsync(deleteId)
      toast.success('Sale deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete sale')
    }
  }

  const columns: Column<Sale>[] = [
    { key: 'invoice', header: 'Invoice', cell: (item) => <span className="font-medium">{item.invoice_number}</span> },
    { key: 'customer', header: 'Customer', cell: (item) => item.customer_name || 'Walk-in' },
    { key: 'date', header: 'Date', cell: (item) => item.sale_date },
    { key: 'amount', header: 'Net Amount', cell: (item) => `$${item.net_amount}` },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.payment_status === 'paid' ? 'default' : 'secondary'}>
          {item.payment_status}
        </Badge>
      ),
    },
    {
      key: 'method',
      header: 'Payment',
      cell: (item) => <Badge variant="outline">{item.payment_method}</Badge>,
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
        title="Sales"
        description="Record and manage customer sales"
        action={
          <Button onClick={() => { setSelectedSale(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Sale
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search sales..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safeSales}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No sales found"
      />

      <SaleForm open={formOpen} onOpenChange={setFormOpen} sale={selectedSale} />
      <SaleDetail open={detailOpen} onOpenChange={setDetailOpen} sale={selectedSale} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Sale"
        description="Are you sure you want to delete this sale? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteSale.isPending}
      />
    </div>
  )
}
