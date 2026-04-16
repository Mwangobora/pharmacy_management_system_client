'use client';

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Pill } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormFieldWrapper } from '@/components/forms/FormPrimitives'
import { AuthApi } from '@/api/AuthApi'
import { ROUTES } from '@/routes/paths'

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await AuthApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })
      toast.success('Account created successfully! Please sign in.')
      navigate(ROUTES.LOGIN)
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pill className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Get started with your pharmacy management</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldWrapper label="Username" htmlFor="username" error={errors.username?.message}>
                <Input id="username" placeholder="johndoe" {...register('username')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Password" htmlFor="password" error={errors.password?.message}>
                <Input id="password" type="password" placeholder="Create a password" {...register('password')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
                <Input id="confirmPassword" type="password" placeholder="Confirm password" {...register('confirmPassword')} />
              </FormFieldWrapper>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
