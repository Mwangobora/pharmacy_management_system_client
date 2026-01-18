import type { LoginPayload, RegisterPayload, AuthTokens, User } from '@/types/auth'
import { httpClient } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export class AuthApi {
  static async login(payload: LoginPayload): Promise<AuthTokens> {
    return httpClient.post<AuthTokens>(ENDPOINTS.AUTH_LOGIN, payload)
  }

  static async register(payload: RegisterPayload): Promise<User> {
    return httpClient.post<User>(ENDPOINTS.AUTH_REGISTER, payload)
  }

  static async refreshToken(refreshToken: string): Promise<{ access: string }> {
    return httpClient.post<{ access: string }>(ENDPOINTS.AUTH_REFRESH, { refresh: refreshToken })
  }

  static async verifyToken(token: string): Promise<void> {
    return httpClient.post<void>(ENDPOINTS.AUTH_VERIFY, { token })
  }

  static async logout(): Promise<void> {
    return httpClient.post<void>(ENDPOINTS.AUTH_LOGOUT)
  }
}
