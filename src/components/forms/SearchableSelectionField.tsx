'use client';

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchInput } from '@/components/SearchInput'

interface SearchableSelectionItem {
  id: number
  label: string
  hint?: string
  description?: string
  searchText?: string
}

interface SearchableSelectionFieldProps {
  items: SearchableSelectionItem[]
  selected: number[]
  onToggle: (id: number) => void
  title: string
  searchPlaceholder: string
  emptyMessage: string
  noResultsMessage: string
}

export function SearchableSelectionField({
  items,
  selected,
  onToggle,
  title,
  searchPlaceholder,
  emptyMessage,
  noResultsMessage,
}: SearchableSelectionFieldProps) {
  const [search, setSearch] = useState('')

  const selectedItems = useMemo(
    () => items.filter((item) => selected.includes(item.id)),
    [items, selected],
  )

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return items
    }

    return items.filter((item) => {
      const haystack = (
        item.searchText ||
        `${item.label} ${item.hint || ''} ${item.description || ''}`
      ).toLowerCase()
      return haystack.includes(query)
    })
  }, [items, search])

  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">
            {selected.length} selected
          </p>
        </div>
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
            debounceMs={150}
          />
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Selected
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="gap-1.5 pr-1"
              >
                <span className="truncate">{item.label}</span>
                <button
                  type="button"
                  className="rounded-full p-0.5 transition hover:bg-background/80"
                  onClick={() => onToggle(item.id)}
                  aria-label={`Remove ${item.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-64 space-y-2 overflow-auto rounded-lg border border-border/60 p-2">
        {items.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground">
            {noResultsMessage}
          </p>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selected.includes(item.id)

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-md px-2 py-2 text-sm transition hover:bg-muted/50"
              >
                <label className="flex min-w-0 flex-1 items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(item.id)}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="block text-xs text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                    {item.description && (
                      <span className="block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </span>
                </label>
                {isSelected && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => onToggle(item.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
