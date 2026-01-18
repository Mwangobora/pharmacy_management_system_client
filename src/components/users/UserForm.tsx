'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveModal } from '@/components/ResponsiveModal'
import { useCreateUser, useUpdateUser } from '@/hooks/mutations/useUsers'
import { useRoles } from '@/hooks/queries/useRoles'
import type { User } from '@/types/auth'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
  role: z.string().optional(),
})

type FormData = z.input<typeof schema>

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserForm({ open, onOpenChange, user }: UserFormProps) {
  const { data: roles = [] } = useRoles()
  const safeRoles = Array.isArray(roles) ? roles : []
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isEditing = !!user

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role ? String(user.role) : '',
      })
    } else {
      reset({ username: '', email: '', password: '', role: '' })
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const roleValue = data.role ? Number(data.role) : undefined
      if (isEditing) {
        await updateUser.mutateAsync({
          id: user.id,
          payload: {
            username: data.username,
            email: data.email,
            role: roleValue,
          },
        })
        toast.success('User updated successfully')
      } else {
        if (!data.password) {
          toast.error('Password is required')
          return
        }
        await createUser.mutateAsync({
          username: data.username,
          email: data.email,
          password: data.password,
          role: roleValue,
        })
        toast.success('User created successfully')
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? 'Failed to update user' : 'Failed to create user')
    }
  }

  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit User' : 'Add User'}
      description="Create or update user accounts"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={watch('role') || 'none'} onValueChange={(v) => setValue('role', v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No role</SelectItem>
              {safeRoles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
