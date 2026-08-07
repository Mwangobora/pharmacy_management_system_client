'use client';

import type { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ResponsiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  /** Action buttons pinned below the scrollable content (e.g. Edit / Delete / Close). */
  footer?: ReactNode
  dialogContentClassName?: string
  desktopScrollable?: boolean
  mobileScrollable?: boolean
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dialogContentClassName,
  desktopScrollable = true,
  mobileScrollable = true,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          {mobileScrollable ? (
            <ScrollArea className="max-h-[calc(100vh-200px)] px-4 pb-4">
              {children}
            </ScrollArea>
          ) : (
            <div className="px-4 pb-4">{children}</div>
          )}
          {footer && (
            <div className="flex flex-col gap-2 border-t border-border/60 px-4 py-3 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          desktopScrollable && 'flex max-h-[90vh] flex-col overflow-hidden',
          !desktopScrollable && 'overflow-visible',
          dialogContentClassName,
        )}
      >
        <DialogHeader className={desktopScrollable ? 'shrink-0' : undefined}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {desktopScrollable ? (
          // Plain overflow-y-auto, not the Radix ScrollArea component: Radix's
          // viewport sizes itself with height:100%, which never resolves inside
          // a flex-col dialog that only has max-height (not a definite height) -
          // the percentage collapses to content size and the dialog's own
          // overflow-hidden hard-clips it instead of scrolling. A flex item's
          // *own* box (this div, via min-h-0 + flex-1) does get a genuinely
          // definite height from the flex algorithm, so native overflow works.
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        ) : (
          <div>{children}</div>
        )}
        {footer && (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
