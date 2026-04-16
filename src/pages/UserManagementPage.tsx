import { SectionTabsLayout } from '@/components/layout/SectionTabsLayout'
import { ROUTES } from '@/routes/paths'

const tabs = [
  { label: 'Users', to: ROUTES.USERS },
  { label: 'Roles', to: ROUTES.ROLES },
  { label: 'Permissions', to: ROUTES.PERMISSIONS },
  { label: 'Audit Logs', to: ROUTES.AUDIT_LOGS },
]

export default function UserManagementPage() {
  return (
    <SectionTabsLayout
      title="User Management"
      description="Manage users, access controls, and security events from a single workspace."
      tabs={tabs}
    />
  )
}
