'use client';

import { CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="View payment history and receipts" />
      <EmptyState
        title="No payments yet"
        description="Payments will appear here once sales are recorded."
        icon={<CreditCard className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>View Reports</Button>}
      />
    </div>
  )
}
