'use client';

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { SearchInput } from '@/components/SearchInput'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorState } from '@/components/ErrorState'
import { useCategories } from '@/hooks/queries/useCategories'
import { useDeleteCategory } from '@/hooks/mutations/useCategories'
import type { Category } from '@/types/inventory'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryDetail } from '@/components/categories/CategoryDetail'
import { CategoryBulkForm } from '@/components/categories/CategoryBulkForm'

export default function CategoriesPage() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: categories = [], isLoading, isError, refetch } = useCategories({ search })
  const deleteCategory = useDeleteCategory()

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleView = (category: Category) => {
    setSelectedCategory(category)
    setDetailOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory.mutateAsync(deleteId)
      toast.success('Category deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'code', header: 'Code', cell: (item) => <Badge variant="outline">{item.code}</Badge> },
    { key: 'medicine_count', header: 'Medicines', cell: (item) => item.medicine_count },
    {
      key: 'is_active',
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
        title="Categories"
        description="Manage medicine categories"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBulkOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Bulk Add
            </Button>
            <Button onClick={() => { setSelectedCategory(null); setFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>
      </div>

      <DataTable columns={columns} data={categories} isLoading={isLoading} keyExtractor={(item) => item.id} emptyMessage="No categories found" />

      <CategoryForm open={formOpen} onOpenChange={setFormOpen} category={selectedCategory} />
      <CategoryBulkForm open={bulkOpen} onOpenChange={setBulkOpen} />
      <CategoryDetail open={detailOpen} onOpenChange={setDetailOpen} category={selectedCategory} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteCategory.isPending}
      />
    </div>
  )
}
