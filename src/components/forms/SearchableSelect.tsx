'use client';

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface SearchableSelectOption {
  value: string
  label: string
  /** Secondary line shown under the label, e.g. category or contact info. Also searched. */
  hint?: string
  searchText?: string
  disabled?: boolean
}

interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

/**
 * A searchable dropdown for long option lists (medicines, suppliers, ...).
 * A plain <Select> forces staff to scroll through everything alphabetically;
 * this lets them type a few letters and jump straight to the match.
 */
export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) =>
      (option.searchText || `${option.label} ${option.hint || ''}`).toLowerCase().includes(q),
    )
  }, [options, query])

  useEffect(() => {
    if (open) {
      // Defer state updates to avoid synchronous setState inside effect which can cause
      // cascading renders. Also focus the input after state has updated.
      requestAnimationFrame(() => {
        setQuery('')
        setHighlighted(0)
        inputRef.current?.focus()
      })
    }
  }, [open])

  const selectOption = (option: SearchableSelectOption) => {
    if (option.disabled) return
    onValueChange(option.value)
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = filtered[highlighted]
      if (option) selectOption(option)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <span className={cn('truncate text-left', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setHighlighted(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-64 overflow-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            filtered.map((option, index) => (
              <button
                type="button"
                key={option.value}
                disabled={option.disabled}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlighted(index)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  index === highlighted ? 'bg-muted' : 'hover:bg-muted/60',
                )}
              >
                <Check className={cn('mt-0.5 h-4 w-4 shrink-0', option.value === value ? 'opacity-100' : 'opacity-0')} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{option.label}</span>
                  {option.hint && <span className="block truncate text-xs text-muted-foreground">{option.hint}</span>}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
