interface PurchaseInfoTileProps {
  label: string
  value: string
}

export function PurchaseInfoTile({ label, value }: PurchaseInfoTileProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

