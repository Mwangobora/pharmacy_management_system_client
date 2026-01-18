'use client';

import { KeyRound } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Permissions" description="Control feature-level access" />
      <EmptyState
        title="No permissions view yet"
        description="This page will list system permissions and role mappings."
        icon={<KeyRound className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>Manage Permissions</Button>}
      />
    </div>
  )
}
