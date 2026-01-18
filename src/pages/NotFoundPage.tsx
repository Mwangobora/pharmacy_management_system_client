'use client';

import { Link } from 'react-router-dom'
import { FileX2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <FileX2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or was moved.
        </p>
        <Button asChild className="mt-6">
          <Link to={ROUTES.HOME}>Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
