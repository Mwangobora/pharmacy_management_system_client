import { SectionTabsLayout } from '@/components/layout/SectionTabsLayout'
import { ROUTES } from '@/routes/paths'

const tabs = [
  { label: 'Customers', to: ROUTES.CUSTOMERS },
  { label: 'Sales', to: ROUTES.SALES },
  { label: 'Payments', to: ROUTES.PAYMENTS },
]

export default function SalesBillingPage() {
  return (
    <SectionTabsLayout
      title="Sales & Billing"
      description="Monitor customer activity, sales performance, and payment records in one flow."
      tabs={tabs}
    />
  )
}
