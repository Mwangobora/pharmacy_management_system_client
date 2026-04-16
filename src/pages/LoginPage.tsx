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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pill className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              </FormFieldWrapper>

              <FormFieldWrapper label="Password" htmlFor="password" error={errors.password?.message}>
                <Input id="password" type="password" placeholder="Enter your password" {...register('password')} />
              </FormFieldWrapper>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
