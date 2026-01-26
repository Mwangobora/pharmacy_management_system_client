import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
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
  ChevronDown,
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/routes/paths'
import { PermissionGuard } from '@/components/PermissionGuard'
import { usePermission } from '@/hooks/usePermissions'

type NavItem = {
  name: string
  href: string
  icon: typeof Home
  permission?: string
  anyPermissions?: string[]
}

type NavSection = {
  name: string
  icon: typeof Home
  permission?: string
  anyPermissions?: string[]
  items: NavItem[]
}

const navigation: NavItem[] = [
  { name: 'Home', href: ROUTES.HOME, icon: Home },
]

const userManagementSection: NavSection = {
  name: 'User Management',
  icon: Users,
  anyPermissions: ['view_user', 'add_user', 'change_user', 'delete_user', 'view_role', 'add_role', 'change_role', 'delete_role', 'view_permission'],
  items: [
    { name: 'Users', href: ROUTES.USERS, icon: Users, anyPermissions: ['view_user', 'add_user', 'change_user', 'delete_user'] },
    { name: 'Roles', href: ROUTES.ROLES, icon: Shield, anyPermissions: ['view_role', 'add_role', 'change_role', 'delete_role'] },
    { name: 'Permissions', href: ROUTES.PERMISSIONS, icon: Key, anyPermissions: ['view_permission', 'add_permission', 'change_permission', 'delete_permission'] },
  ],
}

const inventorySection: NavSection = {
  name: 'Inventory',
  icon: Package,
  anyPermissions: ['view_category', 'view_medicine', 'view_stocktransaction', 'add_medicine', 'change_medicine'],
  items: [
    { name: 'Categories', href: ROUTES.CATEGORIES, icon: Package, anyPermissions: ['view_category', 'add_category', 'change_category', 'delete_category'] },
    { name: 'Medicines', href: ROUTES.MEDICINES, icon: Pill, anyPermissions: ['view_medicine', 'add_medicine', 'change_medicine', 'delete_medicine'] },
    { name: 'Stock Transactions', href: ROUTES.STOCK_TRANSACTIONS, icon: ArrowLeftRight, anyPermissions: ['view_stocktransaction', 'add_stocktransaction'] },
  ],
}

const suppliersSection: NavSection = {
  name: 'Suppliers',
  icon: Truck,
  anyPermissions: ['view_supplier', 'view_purchase', 'add_purchase', 'change_purchase'],
  items: [
    { name: 'Suppliers', href: ROUTES.SUPPLIERS, icon: Truck, anyPermissions: ['view_supplier', 'add_supplier', 'change_supplier', 'delete_supplier'] },
    { name: 'Purchases', href: ROUTES.PURCHASES, icon: ShoppingCart, anyPermissions: ['view_purchase', 'add_purchase', 'change_purchase', 'delete_purchase'] },
  ],
}

const salesSection: NavSection = {
  name: 'Sales',
  icon: Receipt,
  anyPermissions: ['view_customer', 'view_sale', 'add_sale', 'view_payment'],
  items: [
    { name: 'Customers', href: ROUTES.CUSTOMERS, icon: UserCircle, anyPermissions: ['view_customer', 'add_customer', 'change_customer', 'delete_customer'] },
    { name: 'Sales', href: ROUTES.SALES, icon: Receipt, anyPermissions: ['view_sale', 'add_sale', 'change_sale', 'delete_sale'] },
    { name: 'Payments', href: ROUTES.PAYMENTS, icon: CreditCard, anyPermissions: ['view_payment', 'add_payment', 'change_payment'] },
  ],
}

export function AppSidebar() {
  const location = useLocation()
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(true)
  const [isInventoryOpen, setIsInventoryOpen] = useState(true)
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(true)
  const [isSalesOpen, setIsSalesOpen] = useState(true)

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

  const renderCollapsibleSection = (section: NavSection, isOpen: boolean, setIsOpen: (value: boolean) => void) => {
    const visibleItems = section.items.filter(item => {
      if (!item.anyPermissions && !item.permission) return true
      // Check if user has permission to see this item
      // We'll use a hook to check this
      return true // Will be filtered by PermissionGuard
    })

    // Don't render section if no items are visible
    if (visibleItems.length === 0 && section.anyPermissions) {
      return null
    }

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <section.icon className="h-4 w-4" />
            <span>{section.name}</span>
            {isOpen ? (
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            )}
          </SidebarMenuButton>
          {isOpen && (
            <SidebarMenuSub>
              {section.items.map((item) => (
                <PermissionGuard
                  key={item.name}
                  permission={item.permission}
                  anyPermissions={item.anyPermissions}
                >
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={location.pathname === item.href}>
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </PermissionGuard>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

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
        <SidebarGroup>
          <SidebarGroupContent>
            <PermissionGuard anyPermissions={userManagementSection.anyPermissions}>
              {renderCollapsibleSection(userManagementSection, isUserManagementOpen, setIsUserManagementOpen)}
            </PermissionGuard>

            <PermissionGuard anyPermissions={inventorySection.anyPermissions}>
              {renderCollapsibleSection(inventorySection, isInventoryOpen, setIsInventoryOpen)}
            </PermissionGuard>

            <PermissionGuard anyPermissions={suppliersSection.anyPermissions}>
              {renderCollapsibleSection(suppliersSection, isSuppliersOpen, setIsSuppliersOpen)}
            </PermissionGuard>

            <PermissionGuard anyPermissions={salesSection.anyPermissions}>
              {renderCollapsibleSection(salesSection, isSalesOpen, setIsSalesOpen)}
            </PermissionGuard>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
