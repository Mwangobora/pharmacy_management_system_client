import { SectionTabsLayout } from '@/components/layout/SectionTabsLayout'
import { ROUTES } from '@/routes/paths'

const tabs = [
  { label: 'Categories', to: ROUTES.CATEGORIES },
  { label: 'Medicines', to: ROUTES.MEDICINES },
  { label: 'Stock Transactions', to: ROUTES.STOCK_TRANSACTIONS },
]

export default function InventoryManagementPage() {
  return (
    <SectionTabsLayout
      title="Inventory"
      description="Track product catalog, medicine stock, and inventory movement at scale."
      tabs={tabs}
    />
  )
}
