import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { DetailHero } from '@/components/detail/DetailHero'
import { DetailInfoCard } from '@/components/detail/DetailInfoCard'
import type { PermissionDetail as PermissionDetailType } from '@/types/auth'

interface PermissionDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: PermissionDetailType | null
}

export function PermissionDetail({ open, onOpenChange, permission }: PermissionDetailProps) {
  if (!permission) return null

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Permission Details"
      description="What this permission allows a role to do."
      dialogContentClassName="sm:max-w-xl"
      footer={
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="space-y-6 pb-1">
        <DetailHero
          icon={KeyRound}
          title={permission.name}
          subtitle={permission.description || 'No description provided'}
          gradientClassName="from-emerald-50 via-background to-teal-50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20"
          iconClassName="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
          badges={[
            { label: permission.module || 'General', variant: 'outline' },
            ...(permission.resource ? [{ label: permission.resource, variant: 'secondary' as const }] : []),
            ...(permission.action ? [{ label: permission.action, variant: 'secondary' as const }] : []),
          ]}
        />

        <DetailInfoCard
          title="System Reference"
          description="Used by administrators when auditing role access"
          icon={KeyRound}
          items={[{ label: 'Permission Key', value: permission.codename }]}
        />
      </div>
    </ResponsiveModal>
  )
}
