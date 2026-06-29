interface PurchaseCompactStatProps {
  label: string
  value: string
}

export function PurchaseCompactStat({ label, value }: PurchaseCompactStatProps) {
  return (
    <div className="rounded-xl bg-background/70 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

