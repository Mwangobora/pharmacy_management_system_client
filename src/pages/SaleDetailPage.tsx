'use client';

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSale } from '@/hooks/queries/useSales'
import { SaleDetailContent } from '@/components/sales/SaleDetailContent'

function SaleDetailSkeleton() {
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

export default function SaleDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: sale, isLoading, isError, refetch } = useSale(id)

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sale Detail"
        description="Review the full invoice, payment history, and deducted batches."
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      {isLoading ? (
        <SaleDetailSkeleton />
      ) : sale ? (
        <SaleDetailContent sale={sale} />
      ) : (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            The selected sale could not be found.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
