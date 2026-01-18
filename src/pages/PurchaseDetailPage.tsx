'use client';

import { useParams } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'

export default function PurchaseDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Detail" description="Review items, totals, and payment status" />
      <EmptyState
        title="Purchase detail view"
        description={id ? `Purchase ID: ${id}` : 'Select a purchase to view details.'}
        icon={<PackageOpen className="h-10 w-10 text-muted-foreground" />}
      />
    </div>
  )
}
