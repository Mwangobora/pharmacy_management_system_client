'use client'

import { CalendarDays, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PosHeaderProps {
  dateLabel: string
  username?: string | null
}

export function PosHeader({ dateLabel, username }: PosHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Pharmacy Sales</h1>
        <p className="text-sm text-muted-foreground">
          Search medicines, add items and complete a sale
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {username && (
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <UserRound className="h-3.5 w-3.5" />
            {username}
          </Badge>
        )}
        <Badge variant="outline" className="gap-1.5 px-3 py-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateLabel}
        </Badge>
      </div>
    </div>
  )
}
