import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { MedicineDetailItem } from '@/types/medicine-detail'

interface MedicineDetailSectionProps {
  title: string
  description: string
  icon: LucideIcon
  items: MedicineDetailItem[]
}

export function MedicineDetailSection({
  title,
  description,
  icon: Icon,
  items,
}: MedicineDetailSectionProps) {
  return (
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

