const tanzanianShillingFormatter = new Intl.NumberFormat('en-TZ', {
  style: 'currency',
  currency: 'TZS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatTzsCurrency(amount: string | number | null | undefined): string {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) {
    return tanzanianShillingFormatter.format(0)
  }

  return tanzanianShillingFormatter.format(numericAmount)
}
