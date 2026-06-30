'use client';

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useUpdatePurchasePaymentStatus } from '@/hooks/mutations/usePurchases'
import { usePurchase } from '@/hooks/queries/usePurchases'
import { notify } from '@/lib/notify'
import { PurchaseDetailContent } from '@/components/purchases/PurchaseDetailContent'

function PurchaseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-3xl bg-muted/50" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-56 animate-pulse rounded-3xl bg-muted/50" />
        <div className="h-56 animate-pulse rounded-3xl bg-muted/50" />
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-muted/50" />
    </div>
  )
}

export default function PurchaseDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: purchase, isLoading, isError, refetch } = usePurchase(id)
  const updatePaymentStatus = useUpdatePurchasePaymentStatus()

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  const handlePaymentStatusUpdate = async (
    paymentStatus: 'pending' | 'partial' | 'paid',
  ) => {
    if (!purchase) return

    try {
      await updatePaymentStatus.mutateAsync({
        id: purchase.id,
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
    <div className="space-y-6">
      <PageHeader
        title="Purchase Detail"
        description="Review supplier, receiving, and financial details for this purchase."
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      {isLoading ? (
        <PurchaseDetailSkeleton />
      ) : purchase ? (
        <PurchaseDetailContent
          purchase={purchase}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
          isUpdatingPayment={updatePaymentStatus.isPending}
        />
      ) : (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            The selected purchase could not be found.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
