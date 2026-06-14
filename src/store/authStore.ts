import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens } from '@/types/auth'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  permissions: string[]
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateAccessToken: (accessToken: string) => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      permissions: [],

      setUser: (user) => {
        const permissions = user?.permissions || []
        set({ user, permissions })
      },

      setTokens: (tokens) => set({ tokens, isAuthenticated: !!tokens }),

      login: (user, tokens) => {
        const permissions = user?.permissions || []
        set({
          user,
          tokens,
          isAuthenticated: true,
          permissions,
        })
      },

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          permissions: [],
        }),

      updateAccessToken: (accessToken) => {
        const currentTokens = get().tokens
        if (currentTokens) {
          set({
            tokens: { ...currentTokens, access: accessToken },
          })
        }
      },

      hasPermission: (permission) => {
        const { permissions, user } = get()
        if (user?.is_active === false) return false
        if (user?.is_staff && user?.permissions?.includes('*')) return true
        return permissions.includes(permission)
      },

      hasAnyPermission: (requiredPermissions) => {
        const { permissions, user } = get()
        if (user?.is_active === false) return false
        return requiredPermissions.some(p => permissions.includes(p))
      },

      hasAllPermissions: (requiredPermissions) => {
        const { permissions, user } = get()
        if (user?.is_active === false) return false
        return requiredPermissions.every(p => permissions.includes(p))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
)
