'use client';

import { Receipt } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Purchases" description="Track supplier purchase orders" />
      <EmptyState
        title="No purchase orders yet"
        description="Create a purchase order to record incoming stock."
        icon={<Receipt className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>New Purchase</Button>}
      />
    </div>
  )
}
