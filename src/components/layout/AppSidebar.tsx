import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Shield,
  Key,
  Package,
  Pill,
  ArrowLeftRight,
  Truck,
  ShoppingCart,
  UserCircle,
  CreditCard,
  Receipt,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/routes/paths'

type NavItem = {
  name: string
  href: string
  icon: typeof Home
}

const navigation: NavItem[] = [
  { name: 'Home', href: ROUTES.HOME, icon: Home },
]

const userManagement: NavItem[] = [
  { name: 'Users', href: ROUTES.USERS, icon: Users },
  { name: 'Roles', href: ROUTES.ROLES, icon: Shield },
  { name: 'Permissions', href: ROUTES.PERMISSIONS, icon: Key },
]

const inventory: NavItem[] = [
  { name: 'Categories', href: ROUTES.CATEGORIES, icon: Package },
  { name: 'Medicines', href: ROUTES.MEDICINES, icon: Pill },
  { name: 'Stock Transactions', href: ROUTES.STOCK_TRANSACTIONS, icon: ArrowLeftRight },
]

const suppliers: NavItem[] = [
  { name: 'Suppliers', href: ROUTES.SUPPLIERS, icon: Truck },
  { name: 'Purchases', href: ROUTES.PURCHASES, icon: ShoppingCart },
]

const sales: NavItem[] = [
  { name: 'Customers', href: ROUTES.CUSTOMERS, icon: UserCircle },
  { name: 'Sales', href: ROUTES.SALES, icon: Receipt },
  { name: 'Payments', href: ROUTES.PAYMENTS, icon: CreditCard },
]

export function AppSidebar() {
  const location = useLocation()

  const renderNavGroup = (items: NavItem[], label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-semibold">PharmaSys</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderNavGroup(navigation, 'Dashboard')}
        {renderNavGroup(userManagement, 'User Management')}
        {renderNavGroup(inventory, 'Inventory')}
        {renderNavGroup(suppliers, 'Suppliers')}
        {renderNavGroup(sales, 'Sales')}
      </SidebarContent>
    </Sidebar>
  )
}
