'use client';

import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage staff accounts and access" />
      <EmptyState
        title="No user management UI yet"
        description="This page will list staff users, roles, and status controls."
        icon={<UserPlus className="h-10 w-10 text-muted-foreground" />}
        action={<Button variant="outline" disabled>Invite User</Button>}
      />
    </div>
  )
}
