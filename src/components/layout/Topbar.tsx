import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/themes/ThemeToggle'
import { UserMenu } from './UserMenu'

const titleMap: Record<string, string> = {
  '/dashboard/home': 'Overview',
  '/dashboard/user-management': 'User Management',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/procurement': 'Procurement',
  '/dashboard/sales-billing': 'Sales & Billing',
  '/dashboard/profile': 'Profile',
}

export function Topbar() {
  const location = useLocation()

  const currentTitle =
    Object.entries(titleMap).find(([path]) => location.pathname.startsWith(path))?.[1] ||
    'Pharmacy Management'

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-border/70 bg-background/85 px-4 backdrop-blur-md md:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="size-9 rounded-lg border border-border/70 bg-background hover:bg-accent" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Admin Console</p>
            <h1 className="text-sm font-semibold md:text-base">{currentTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
