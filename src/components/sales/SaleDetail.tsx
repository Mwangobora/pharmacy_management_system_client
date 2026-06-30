import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useSale } from '@/hooks/queries/useSales'
import type { Sale } from '@/types/sales'
import { SaleDetailContent } from './SaleDetailContent'

interface SaleDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
}

export function SaleDetail({ open, onOpenChange, sale }: SaleDetailProps) {
  const saleId = open && sale ? sale.id : ''
  const { data: saleDetails } = useSale(saleId)

  if (!sale) return null

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Sale Details"
      description="Review the invoice, items, payments, and batch deductions."
      dialogContentClassName="sm:max-w-5xl"
    >
      <SaleDetailContent sale={saleDetails ?? sale} />
    </ResponsiveModal>
  )
}
