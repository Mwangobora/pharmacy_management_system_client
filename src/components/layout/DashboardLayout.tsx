'use client';

import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Topbar } from './Topbar'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
