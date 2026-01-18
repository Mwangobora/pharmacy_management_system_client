import { Link } from 'react-router-dom'
import { Package, Pill, AlertTriangle, Clock, TrendingUp, Users, Truck, Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/StatCard'
import { useDashboardStats, useLowStockMedicines, useExpiringSoonMedicines } from '@/hooks/queries/useMedicines'
import { ROUTES } from '@/routes/paths'

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: lowStock = [], isLoading: lowStockLoading } = useLowStockMedicines()
  const { data: expiringSoon = [], isLoading: expiringLoading } = useExpiringSoonMedicines()

  const quickLinks = [
    { name: 'Categories', href: ROUTES.CATEGORIES, icon: Package, color: 'bg-blue-500' },
    { name: 'Medicines', href: ROUTES.MEDICINES, icon: Pill, color: 'bg-green-500' },
    { name: 'Suppliers', href: ROUTES.SUPPLIERS, icon: Truck, color: 'bg-orange-500' },
    { name: 'Sales', href: ROUTES.SALES, icon: Receipt, color: 'bg-purple-500' },
    { name: 'Customers', href: ROUTES.CUSTOMERS, icon: Users, color: 'bg-pink-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your pharmacy management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard title="Total Medicines" value={stats?.total_medicines || 0} icon={Pill} />
            <StatCard title="Low Stock" value={stats?.low_stock_count || 0} icon={AlertTriangle} description="Needs attention" />
            <StatCard title="Expiring Soon" value={stats?.expiring_soon_count || 0} icon={Clock} description="Within 30 days" />
            <StatCard title="Total Value" value={`$${stats?.total_value || '0'}`} icon={TrendingUp} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Medicines that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No low stock items</p>
            ) : (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((med) => (
                  <div key={med.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.category_name}</p>
                    </div>
                    <span className="text-sm font-medium text-destructive">{med.stock_quantity} left</span>
                  </div>
                ))}
                {lowStock.length > 5 && <Button variant="link" asChild className="px-0"><Link to={ROUTES.MEDICINES}>View all ({lowStock.length})</Link></Button>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Medicines expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringLoading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : expiringSoon.length === 0 ? (
              <p className="text-sm text-muted-foreground">No medicines expiring soon</p>
            ) : (
              <div className="space-y-2">
                {expiringSoon.slice(0, 5).map((med) => (
                  <div key={med.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">Batch: {med.batch_number}</p>
                    </div>
                    <span className="text-sm font-medium text-orange-500">{med.days_to_expiry} days</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {quickLinks.map((link) => (
              <Link key={link.name} to={link.href} className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.color} text-white`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
