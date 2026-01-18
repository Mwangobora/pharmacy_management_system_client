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
import { PurchaseForm } from '@/components/purchases/PurchaseForm'
import { PurchaseDetail } from '@/components/purchases/PurchaseDetail'
import { usePurchases } from '@/hooks/queries/usePurchases'
import { useDeletePurchase } from '@/hooks/mutations/usePurchases'
import type { Purchase } from '@/types/suppliers'

export default function PurchasesPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: purchases = [], isLoading, isError, refetch } = usePurchases({ search })
  const safePurchases = Array.isArray(purchases) ? purchases : []
  const deletePurchase = useDeletePurchase()

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setFormOpen(true)
  }

  const handleView = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePurchase.mutateAsync(deleteId)
      toast.success('Purchase deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete purchase')
    }
  }

  const columns: Column<Purchase>[] = [
    { key: 'invoice', header: 'Invoice', cell: (item) => <span className="font-medium">{item.invoice_number}</span> },
    { key: 'supplier', header: 'Supplier', cell: (item) => item.supplier_name },
    { key: 'date', header: 'Date', cell: (item) => item.purchase_date },
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
        title="Purchases"
        description="Track supplier purchase orders"
        action={
          <Button onClick={() => { setSelectedPurchase(null); setFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Purchase
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search purchases..." />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safePurchases}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No purchases found"
      />

      <PurchaseForm open={formOpen} onOpenChange={setFormOpen} purchase={selectedPurchase} />
      <PurchaseDetail open={detailOpen} onOpenChange={setDetailOpen} purchase={selectedPurchase} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Purchase"
        description="Are you sure you want to delete this purchase? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deletePurchase.isPending}
      />
    </div>
  )
}
