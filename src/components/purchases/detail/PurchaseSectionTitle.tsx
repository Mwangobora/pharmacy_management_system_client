import type { LucideIcon } from 'lucide-react'

interface PurchaseSectionTitleProps {
  icon: LucideIcon
  title: string
  subtitle: string
}

export function PurchaseSectionTitle({
  icon: Icon,
  title,
  subtitle,
}: PurchaseSectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

