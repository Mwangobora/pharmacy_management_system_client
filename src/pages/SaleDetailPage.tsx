'use client';

import { useParams } from 'react-router-dom'
import { ReceiptText } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'

export default function SaleDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <PageHeader title="Sale Detail" description="Review items, payments, and status" />
      <EmptyState
        title="Sale detail view"
        description={id ? `Sale ID: ${id}` : 'Select a sale to view details.'}
        icon={<ReceiptText className="h-10 w-10 text-muted-foreground" />}
      />
    </div>
  )
}
