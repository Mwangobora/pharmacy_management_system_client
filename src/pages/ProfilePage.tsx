'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, UserCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { useProfile } from '@/hooks/queries/useProfile'
import { useChangePassword, useUpdateProfile } from '@/hooks/mutations/useProfile'
import { useAuthStore } from '@/store/authStore'

const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
})

type ProfileFormData = z.input<typeof profileSchema>
type PasswordFormData = z.input<typeof passwordSchema>

export default function ProfilePage() {
  const { data: profile } = useProfile()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const setUser = useAuthStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', email: '' },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({ username: profile.username, email: profile.email })
      setUser(profile)
    }
  }, [profile, reset, setUser])

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const updated = await updateProfile.mutateAsync(data)
      setUser(updated)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync(data)
      toast.success('Password updated')
      resetPassword()
    } catch {
      toast.error('Failed to update password')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account details" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your current role and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{profile?.username || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{profile?.role_name || 'No role'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Permissions</p>
              {profile?.role_detail?.permissions_detail?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.role_detail.permissions_detail.map((permission) => (
                    <Badge key={permission.id} variant="outline">
                      {permission.codename}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              )}
            </div>
            <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              Profile photos are not supported by the current API.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your username and email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...register('username')} />
                    {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input id="current_password" type="password" {...registerPassword('current_password')} />
                    {passwordErrors.current_password && (
                      <p className="text-sm text-destructive">{passwordErrors.current_password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input id="new_password" type="password" {...registerPassword('new_password')} />
                    {passwordErrors.new_password && (
                      <p className="text-sm text-destructive">{passwordErrors.new_password.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={changePassword.isPending}>
                    {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
