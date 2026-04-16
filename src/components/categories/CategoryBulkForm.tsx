'use client';

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormActions, FormFieldWrapper, FormLayout, FormSection } from '@/components/forms/FormPrimitives'
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
      return { data: null, error: 'Invalid JSON format' }
    }
  }, [raw])

  const handleSubmit = async () => {
    if (!parsed.data) {
      toast.error(parsed.error || 'Paste valid JSON data')
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
      <FormLayout>
        <FormSection title="Bulk Input" description="Upload category data in JSON format.">
          <FormFieldWrapper
            label="JSON Payload"
            error={parsed.error && raw.trim() ? parsed.error : undefined}
            helperText='Expected format: [{"name":"Analgesics","display_order":1}]'
          >
            <Textarea
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              placeholder='[{"name":"Analgesics","description":"Pain medicines","display_order":1,"is_active":true}]'
              className="min-h-[240px] font-mono text-xs"
            />
          </FormFieldWrapper>
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={bulkCreate.isPending}>
            {bulkCreate.isPending ? 'Uploading...' : 'Upload JSON'}
          </Button>
        </FormActions>
      </FormLayout>
    </ResponsiveModal>
  )
}
