import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Boxes,
  Truck,
  Receipt,
  Pill,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/routes/paths'
import { PermissionGuard } from '@/components/PermissionGuard'

type NavItem = {
  name: string
  href: string
  icon: typeof Home
  iconClass: string
  permission?: string
  anyPermissions?: string[]
}

const navigation: NavItem[] = [
  { name: 'Home', href: ROUTES.HOME, icon: Home, iconClass: 'text-sky-500 dark:text-sky-400' },
  {
    name: 'User Management',
    href: ROUTES.USER_MANAGEMENT,
    icon: Users,
    iconClass: 'text-indigo-500 dark:text-indigo-400',
    anyPermissions: ['view_user', 'add_user', 'change_user', 'delete_user', 'view_role', 'view_permission'],
  },
  {
    name: 'Inventory',
    href: ROUTES.INVENTORY,
    icon: Boxes,
    iconClass: 'text-emerald-500 dark:text-emerald-400',
    anyPermissions: ['view_category', 'view_medicine', 'view_stocktransaction'],
  },
  {
    name: 'Procurement',
    href: ROUTES.PROCUREMENT,
    icon: Truck,
    iconClass: 'text-orange-500 dark:text-orange-400',
    anyPermissions: ['view_supplier', 'view_purchase'],
  },
  {
    name: 'Sales & Billing',
    href: ROUTES.SALES_BILLING,
    icon: Receipt,
    iconClass: 'text-cyan-500 dark:text-cyan-400',
    anyPermissions: ['view_customer', 'view_sale', 'view_payment'],
  },
]

export function AppSidebar() {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) return location.pathname === ROUTES.HOME
    return location.pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/70 bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-3">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground shadow-sm">
            <Pill className="h-4 w-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">PharmaSys</p>
            <p className="truncate text-xs text-muted-foreground">Enterprise Suite</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {navigation.map((item) => (
            <PermissionGuard key={item.name} permission={item.permission} anyPermissions={item.anyPermissions}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.name}
                  className="h-11 rounded-xl px-3 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 data-[active=true]:bg-sidebar-accent/90 data-[active=true]:shadow-[inset_0_0_0_1px_hsl(var(--sidebar-border))]"
                >
                  <Link to={item.href}>
                    <item.icon className={`h-5 w-5 ${item.iconClass}`} />
                    <span className="text-[13px] font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </PermissionGuard>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
