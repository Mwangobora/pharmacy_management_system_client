import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type SectionTab = {
  label: string
  to: string
}

interface SectionTabsLayoutProps {
  title: string
  description: string
  tabs: SectionTab[]
}

export function SectionTabsLayout({ title, description, tabs }: SectionTabsLayoutProps) {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-card/70 px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </section>

      <section className="space-y-5 rounded-2xl border border-border/60 bg-card px-5 py-5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
        <div className="border-b border-border/70">
          <nav className="-mb-px flex items-center gap-1 overflow-x-auto" aria-label={`${title} tabs`}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    'relative inline-flex min-h-10 items-center justify-center rounded-t-md px-4 text-sm font-medium text-muted-foreground transition-colors',
                    'hover:text-foreground',
                    isActive && 'text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}
                    {isActive && (
                      <motion.span
                        layoutId="section-tab-indicator"
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}
