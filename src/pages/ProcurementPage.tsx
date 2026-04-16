import { SectionTabsLayout } from '@/components/layout/SectionTabsLayout'
import { ROUTES } from '@/routes/paths'

const tabs = [
  { label: 'Suppliers', to: ROUTES.SUPPLIERS },
  { label: 'Purchases', to: ROUTES.PURCHASES },
]

export default function ProcurementPage() {
  return (
    <SectionTabsLayout
      title="Procurement"
      description="Control supplier relationships and purchase operations with clear traceability."
      tabs={tabs}
    />
  )
}
