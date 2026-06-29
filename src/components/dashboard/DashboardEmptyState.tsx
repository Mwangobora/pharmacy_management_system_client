import { Inbox } from 'lucide-react'

interface DashboardEmptyStateProps {
  title: string
  description: string
}

export function DashboardEmptyState({
  title,
  description,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
