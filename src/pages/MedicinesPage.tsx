'use client';

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorState } from '@/components/ErrorState'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useCategories } from '@/hooks/queries/useCategories'
import { useDeleteMedicine } from '@/hooks/mutations/useMedicines'
import type { Medicine } from '@/types/inventory'
import { MedicineForm } from '@/components/medicines/MedicineForm'
import { MedicineDetail } from '@/components/medicines/MedicineDetail'

export default function MedicinesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all') // Updated default value
  const [stockStatus, setStockStatus] = useState<string>('all') // Updated default value
  const [formOpen, setFormOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const listParams = {
    search,
    category: category === 'all' ? undefined : category,
    stock_status: stockStatus === 'all' ? undefined : stockStatus,
  }
  const { data: medicines = [], isLoading, isError, refetch } = useMedicines(listParams)
  const { data: categories = [] } = useCategories()
  const safeCategories = Array.isArray(categories) ? categories : []
  const deleteMedicine = useDeleteMedicine()

  const handleEdit = (medicine: Medicine) => { setSelectedMedicine(medicine); setFormOpen(true) }
  const handleView = (medicine: Medicine) => { setSelectedMedicine(medicine); setDetailOpen(true) }
  const handleDelete = async () => {
    if (!deleteId) return
    try { await deleteMedicine.mutateAsync(deleteId); toast.success('Medicine deleted'); setDeleteId(null) } catch { toast.error('Failed to delete') }
  }

  const getStockBadge = (medicine: Medicine) => {
    if (medicine.stock_quantity <= medicine.min_stock_level) return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Low</Badge>
    if (medicine.stock_quantity >= medicine.max_stock_level) return <Badge variant="secondary">Overstock</Badge>
    return <Badge variant="default">OK</Badge>
  }

  const columns: Column<Medicine>[] = [
    { key: 'name', header: 'Name', cell: (item) => <div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.generic_name}</p></div> },
    { key: 'category', header: 'Category', cell: (item) => item.category_name },
    { key: 'stock', header: 'Stock', cell: (item) => <div className="flex items-center gap-2"><span>{item.stock_quantity} {item.unit}</span>{getStockBadge(item)}</div> },
    { key: 'price', header: 'Price', cell: (item) => `$${item.selling_price}` },
    { key: 'expiry', header: 'Expiry', cell: (item) => <span className={item.days_to_expiry <= 30 ? 'text-destructive' : ''}>{item.expiry_date}</span> },
    { key: 'actions', header: '', className: 'w-[100px]', cell: (item) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ]

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader title="Medicines" description="Manage medicine inventory" action={<Button onClick={() => { setSelectedMedicine(null); setFormOpen(true) }}><Plus className="mr-2 h-4 w-4" /> Add Medicine</Button>} />
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search medicines..." />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem> {/* Updated value */}
            {safeCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stockStatus} onValueChange={setStockStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Stock Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* Updated value */}
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="ok">OK</SelectItem>
            <SelectItem value="overstock">Overstock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={medicines} isLoading={isLoading} keyExtractor={(item) => item.id} emptyMessage="No medicines found" />
      <MedicineForm open={formOpen} onOpenChange={setFormOpen} medicine={selectedMedicine} />
      <MedicineDetail open={detailOpen} onOpenChange={setDetailOpen} medicine={selectedMedicine} />
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Medicine" description="Are you sure?" confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} isLoading={deleteMedicine.isPending} />
    </div>
  )
}
