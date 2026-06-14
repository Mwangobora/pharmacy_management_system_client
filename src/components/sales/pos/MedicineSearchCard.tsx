'use client'

import { Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface MedicineSearchCardProps {
  isLoading: boolean
  searchInput: string
  totalMedicines: number
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export function MedicineSearchCard({
  isLoading,
  searchInput,
  totalMedicines,
  onChange,
  onKeyDown,
}: MedicineSearchCardProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Medicine Search</CardTitle>
        <CardDescription>
          Search by medicine name, generic name, barcode, SKU or active ingredient...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search by medicine name, generic name, barcode, SKU or active ingredient..."
            className="h-12 pl-9 pr-10 text-sm"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{totalMedicines} medicines available</span>
          <span className="hidden sm:inline">Press Enter to add the highlighted result</span>
        </div>
      </CardContent>
    </Card>
  )
}
