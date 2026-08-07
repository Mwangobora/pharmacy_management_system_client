interface DetailQuickRowProps {
  label: string
  value: string
}

export function DetailQuickRow({ label, value }: DetailQuickRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] break-words text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}
