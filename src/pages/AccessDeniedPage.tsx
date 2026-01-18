'use client';

import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/routes/paths'

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <ShieldOff className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to={ROUTES.HOME}>Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
