import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardSection({
  title,
  description,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description ? <CardDescription className="text-base">{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="text-base">{children}</CardContent>
    </Card>
  )
}
