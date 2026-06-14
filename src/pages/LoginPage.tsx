'use client';

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import { useAuthStore } from '@/store/authStore'
import { AuthApi } from '@/api/AuthApi'
import { ROUTES } from '@/routes/paths'

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
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

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

      toast.success('Login successful')
      navigate(from, { replace: true })
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white border-r">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Pill className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">PharmaCare Enterprise</span>
        </div>
        
        <div className="space-y-6">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-normal">
              &ldquo;Streamline your pharmacy operations with our comprehensive management system. 
              From inventory tracking to seamless staff management.&rdquo;
            </p>
            <footer className="text-base text-zinc-400">
              Reliable infrastructure for modern healthcare.
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 md:p-16">
        <motion.div 
          className="w-full max-w-[400px] space-y-8"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="lg:hidden mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pill className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your enterprise account to continue
            </p>
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

          <div className="text-center lg:text-left text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:underline underline-offset-4">
              Request access
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
