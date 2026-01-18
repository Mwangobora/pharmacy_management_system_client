'use client';

import { Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage customer profiles and loyalty points" />
      <EmptyState
        title="No customers yet"
        description="Create customers to track purchases and loyalty history."
        icon={<Users className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>Add Customer</Button>}
      />
    </div>
  )
}
