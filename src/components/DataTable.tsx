import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  cell: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
}

const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-prevent-row-click="true"]',
].join(', ')

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found',
  emptyDescription,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  const safeData = Array.isArray(data) ? data : []
  const isRowClickable = typeof onRowClick === 'function'

  const shouldIgnoreRowClick = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false
    return Boolean(target.closest(INTERACTIVE_SELECTOR))
  }

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, item: T) => {
    if (!onRowClick || shouldIgnoreRowClick(event.target)) return
    onRowClick(item)
  }

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, item: T) => {
    if (!onRowClick || shouldIgnoreRowClick(event.target)) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRowClick(item)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (safeData.length === 0) {
    return <EmptyState title={emptyMessage} description={emptyDescription} />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeData.map((item) => (
            <TableRow
              key={keyExtractor(item)}
              tabIndex={isRowClickable ? 0 : undefined}
              className={isRowClickable ? 'cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40' : undefined}
              onClick={isRowClickable ? (event) => handleRowClick(event, item) : undefined}
              onKeyDown={isRowClickable ? (event) => handleRowKeyDown(event, item) : undefined}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
