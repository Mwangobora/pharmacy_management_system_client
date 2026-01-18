'use client';

import { ShoppingCart } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sales" description="Record and manage customer sales" />
      <EmptyState
        title="No sales recorded"
        description="Create a sale to start tracking revenue and payments."
        icon={<ShoppingCart className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>New Sale</Button>}
      />
    </div>
  )
}
