'use client';

import { useState } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorState } from '@/components/ErrorState'
import { SaleForm } from '@/components/sales/SaleForm'
import { SaleDetail } from '@/components/sales/SaleDetail'
import { useSales } from '@/hooks/queries/useSales'
import { useDeleteSale } from '@/hooks/mutations/useSales'
import { notify } from '@/lib/notify'
import type { Sale } from '@/types/sales'
import { formatTzsCurrency } from '@/lib/currency'

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
      notify.success('Sale deleted successfully')
      setDeleteId(null)
    } catch (error) {
      notify.apiError(error, 'Sale could not be deleted', {
        fallback: 'The sale record could not be deleted.',
      })
    }
  }

  const columns: Column<Sale>[] = [
    { key: 'invoice', header: 'Invoice', cell: (item) => <span className="font-medium">{item.invoice_number}</span> },
    { key: 'customer', header: 'Customer', cell: (item) => item.customer_name || 'Walk-in' },
    { key: 'date', header: 'Date', cell: (item) => item.sale_date },
    { key: 'amount', header: 'Net Amount', cell: (item) => formatTzsCurrency(item.net_amount) },
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

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Sales Records</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review invoices, inspect payment status, and update sale notes when needed.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center gap-3">
            <div className="flex-1">
              <SearchInput value={search} onChange={setSearch} placeholder="Search sales..." />
            </div>
            <Button onClick={() => { setSelectedSale(null); setFormOpen(true) }}>
              Add Sale
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <DataTable
              columns={columns}
              data={safeSales}
              isLoading={isLoading}
              keyExtractor={(item) => item.id}
              emptyMessage="No sales found"
            />
          )}
        </CardContent>
      </Card>

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
