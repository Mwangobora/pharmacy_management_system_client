import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DetailMetricCard } from './DetailMetricCard'
import type { DetailBadgeItem, DetailMetricItem } from './types'

interface DetailHeroProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  badges?: DetailBadgeItem[]
  metrics?: DetailMetricItem[]
  /** Tailwind gradient classes for the hero background. */
  gradientClassName?: string
  /** Tailwind classes for the icon avatar. */
  iconClassName?: string
}

export function DetailHero({
  icon: Icon,
  title,
  subtitle,
  badges = [],
  metrics = [],
  gradientClassName = 'from-sky-50 via-background to-emerald-50 dark:from-sky-950/30 dark:via-background dark:to-emerald-950/20',
  iconClassName = 'bg-sky-600/10 text-sky-700 dark:text-sky-300',
}: DetailHeroProps) {
  return (
    <section className={cn('overflow-hidden rounded-3xl border bg-gradient-to-br', gradientClassName)}>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className={cn('inline-flex h-12 w-12 items-center justify-center rounded-2xl', iconClassName)}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight break-words">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground break-words">{subtitle}</p>}
            </div>
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge
                  key={badge.label}
                  variant={badge.tone ? undefined : badge.variant ?? 'secondary'}
                  className={cn(badge.tone && 'border px-3 py-1 text-xs font-medium', badge.tone)}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {metrics.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <DetailMetricCard key={metric.label} {...metric} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
