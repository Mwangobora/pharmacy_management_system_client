'use client';

import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Topbar } from './Topbar'

const TABLET_BREAKPOINT = 1024

export function DashboardLayout() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= TABLET_BREAKPOINT
  })

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`)

    const handleChange = () => {
      if (media.matches) {
        setOpen(false)
      }
    }

    handleChange()
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-b from-background via-background to-muted/15">
        <Topbar />
        <AnimatePresence mode="wait">
          <motion.main
            className="flex-1 overflow-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  )
}
