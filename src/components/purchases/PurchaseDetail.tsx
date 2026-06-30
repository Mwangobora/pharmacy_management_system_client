import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useUpdatePurchasePaymentStatus } from '@/hooks/mutations/usePurchases'
import { usePurchase } from '@/hooks/queries/usePurchases'
import { notify } from '@/lib/notify'
import type { Purchase } from '@/types/suppliers'
import { PurchaseDetailContent } from './PurchaseDetailContent'

interface PurchaseDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
}

export function PurchaseDetail({
  open,
  onOpenChange,
  purchase,
}: PurchaseDetailProps) {
  const purchaseId = open && purchase ? purchase.id : ''
  const { data: purchaseDetails } = usePurchase(purchaseId)
  const updatePaymentStatus = useUpdatePurchasePaymentStatus()

  if (!purchase) return null

  const resolvedPurchase = purchaseDetails ?? purchase

  const handlePaymentStatusUpdate = async (
    paymentStatus: Purchase['payment_status'],
  ) => {
    try {
      await updatePaymentStatus.mutateAsync({
        id: resolvedPurchase.id,
        payload: { payment_status: paymentStatus },
      })
      notify.success(`Purchase marked as ${paymentStatus}`, {
        description: 'The supplier payment status has been updated.',
      })
    } catch (error) {
      notify.apiError(error, 'Purchase payment status could not be updated', {
        fallback: 'The supplier payment verification could not be saved.',
        persistent: true,
      })
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Purchase Details"
      description="See supplier, financial, and received-item information in one place."
      dialogContentClassName="sm:max-w-5xl"
    >
      <PurchaseDetailContent
        purchase={resolvedPurchase}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        isUpdatingPayment={updatePaymentStatus.isPending}
      />
    </ResponsiveModal>
  )
}
