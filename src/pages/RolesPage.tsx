'use client';

import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Roles" description="Define access roles for staff" />
      <EmptyState
        title="No roles configured"
        description="Create roles to group permissions and assign them to users."
        icon={<ShieldCheck className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>Create Role</Button>}
      />
    </div>
  )
}
