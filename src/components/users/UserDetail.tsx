import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useUser, useUserAccess } from '@/hooks/queries/useUsers'
import type { User } from '@/types/auth'
import { UserDetailContent } from './UserDetailContent'

interface UserDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserDetail({ open, onOpenChange, user }: UserDetailProps) {
  const userId = open && user ? user.id : ''
  const { data: userDetails } = useUser(userId)
  const { data: accessDetails } = useUserAccess(userId)

  if (!user) return null

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="User Details"
      description="Review the user profile, assigned roles, and effective permissions."
      dialogContentClassName="sm:max-w-4xl"
    >
      <UserDetailContent user={userDetails ?? user} access={accessDetails} />
    </ResponsiveModal>
  )
}
