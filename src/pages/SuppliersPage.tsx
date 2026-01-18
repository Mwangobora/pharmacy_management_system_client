'use client';

import { Truck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="Manage vendor and supplier records" />
      <EmptyState
        title="No suppliers loaded"
        description="Add suppliers to start tracking purchase orders."
        icon={<Truck className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>Add Supplier</Button>}
      />
    </div>
  )
}
