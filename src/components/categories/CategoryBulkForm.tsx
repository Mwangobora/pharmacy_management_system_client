'use client';

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useBulkCreateCategories } from '@/hooks/mutations/useCategories'
import type { CategoryCreatePayload } from '@/types/inventory'

interface CategoryBulkFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type BulkPayload = CategoryCreatePayload[] | { results?: CategoryCreatePayload[] }

export function CategoryBulkForm({ open, onOpenChange }: CategoryBulkFormProps) {
  const [raw, setRaw] = useState('')
  const bulkCreate = useBulkCreateCategories()

  const parsed = useMemo(() => {
    if (!raw.trim()) return { data: null as CategoryCreatePayload[] | null, error: '' }
    try {
      const json = JSON.parse(raw) as BulkPayload
      const data = Array.isArray(json) ? json : json.results
      if (!Array.isArray(data)) {
        return { data: null, error: 'JSON must be an array or { "results": [...] }' }
      }
      return { data, error: '' }
    } catch {
      return { data: null, error: 'Invalid JSON' }
    }
  }, [raw])

  const handleSubmit = async () => {
    if (!parsed.data) {
      toast.error(parsed.error || 'Paste a valid JSON array')
      return
    }
    try {
      await bulkCreate.mutateAsync(parsed.data)
      toast.success('Categories added successfully')
      setRaw('')
      onOpenChange(false)
    } catch {
      toast.error('Failed to add categories')
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Bulk Add Categories"
      description="Paste a JSON array of categories"
    >
      <div className="space-y-4">
        <Textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='[{"name":"Analgesics","description":"Pain relieving medicines","code":"ANLG","display_order":1,"is_active":true}]'
          className="min-h-[220px] font-mono text-xs"
        />
        {parsed.error && raw.trim() ? (
          <p className="text-sm text-destructive">{parsed.error}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={bulkCreate.isPending}>
            {bulkCreate.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}
