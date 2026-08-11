'use client';

import { useState } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Pill } from 'lucide-react'
import { motion } from 'framer-motion'
import { LoginImageSlideshow } from '@/components/auth/LoginImageSlideshow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormFieldWrapper } from '@/components/forms/FormPrimitives'
import { useAuthStore } from '@/store/authStore'
import { AuthApi } from '@/api/AuthApi'
import { notify } from '@/lib/notify'
import { ROUTES } from '@/routes/paths'

const DEMO_ACCOUNT = {
  email: 'pharmacyAdmin@gmail.com',
  password: 'pharmacy@123',
}

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const from = location.state?.from?.pathname || ROUTES.HOME

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: DEMO_ACCOUNT,
  })

  const applyDemoCredentials = () => {
    setValue('email', DEMO_ACCOUNT.email, { shouldDirty: true, shouldTouch: true })
    setValue('password', DEMO_ACCOUNT.password, { shouldDirty: true, shouldTouch: true })
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await AuthApi.login(data)
      const { user, access, refresh } = response
      const tokens = { access, refresh }

      if (user) {
        login(user, tokens)
      } else {
        const fetchedUser = await AuthApi.getCurrentUser()
        login(fetchedUser, tokens)
      }

      notify.success('Login successful', {
        description: 'Your pharmacy workspace is ready.',
      })
      navigate(from, { replace: true })
    } catch (error) {
      notify.apiError(error, 'Sign-in failed', {
        fallback: 'Email or password is incorrect.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      <LoginImageSlideshow />

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center p-8 sm:p-12 md:w-[56%] md:p-12 lg:w-1/2 lg:p-16">
        <motion.div
          className="w-full max-w-[400px] space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground md:hidden">
              <Pill className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to the live pharmacy demo workspace
            </p>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Demo pharmacy account</p>
                <p className="text-sm text-muted-foreground">
                  Use this account during pharmacy testing to access the full system.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={applyDemoCredentials}>
                Use demo account
              </Button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/90 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 break-all font-mono text-sm text-foreground">
                  {DEMO_ACCOUNT.email}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/90 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Password
                </p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {DEMO_ACCOUNT.password}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormFieldWrapper label="Email Address" htmlFor="email" error={errors.email?.message}>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                autoComplete="email"
                className="h-11"
                {...register('email')} 
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Password" htmlFor="password" error={errors.password?.message}>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                autoComplete="current-password"
                className="h-11"
                {...register('password')} 
              />
            </FormFieldWrapper>

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
