'use client';

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, type Column } from '@/components/DataTable'
import { ErrorState } from '@/components/ErrorState'
import { DatePicker } from '@/components/DatePicker'
import { StockTransactionsApi } from '@/api/InventoryApi'
import type { StockTransaction } from '@/types/inventory'

const transactionKeys = {
  all: ['stockTransactions'] as const,
  list: (params?: Record<string, string>) => [...transactionKeys.all, 'list', params] as const,
}

export default function StockTransactionsPage() {
  const [transactionType, setTransactionType] = useState<string>('all')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const params: Record<string, string> = {}
  if (transactionType !== 'all') params.transaction_type = transactionType
  if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd')
  if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd')

  const { data: transactions = [], isLoading, isError, refetch } = useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: ({ signal }) => StockTransactionsApi.list(params, signal),
  })

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      purchase: 'default',
      sale: 'secondary',
      adjustment: 'outline',
      return: 'destructive',
    }
    return <Badge variant={variants[type] || 'outline'}>{type}</Badge>
  }

  const columns: Column<StockTransaction>[] = [
    { key: 'date', header: 'Date', cell: (item) => format(new Date(item.transaction_date), 'PPp') },
    { key: 'medicine', header: 'Medicine', cell: (item) => item.medicine_name },
    { key: 'type', header: 'Type', cell: (item) => getTypeBadge(item.transaction_type_display) },
    { key: 'quantity', header: 'Quantity', cell: (item) => (
      <span className={item.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
        {item.quantity > 0 ? '+' : ''}{item.quantity}
      </span>
    ) },
    { key: 'previous', header: 'Previous', cell: (item) => item.previous_quantity },
    { key: 'new', header: 'New', cell: (item) => item.new_quantity },
    { key: 'by', header: 'By', cell: (item) => item.created_by_username },
    { key: 'notes', header: 'Notes', cell: (item) => item.notes || '-' },
  ]

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Transactions" description="View stock movement history" />

      <div className="flex flex-wrap items-center gap-4">
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="return">Return</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <DatePicker value={startDate} onChange={setStartDate} placeholder="Start date" />
          <span className="text-muted-foreground">to</span>
          <DatePicker value={endDate} onChange={setEndDate} placeholder="End date" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No transactions found"
      />
    </div>
  )
}
