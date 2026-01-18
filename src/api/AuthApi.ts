import type {
  LoginPayload,
  RegisterPayload,
  AuthTokens,
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '@/types/auth'
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

  static async getCurrentUser(signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>(ENDPOINTS.AUTH_ME, undefined, signal)
  }

  static async updateCurrentUser(payload: UpdateProfilePayload): Promise<User> {
    return httpClient.patch<User>(ENDPOINTS.AUTH_ME, payload)
  }

  static async changePassword(payload: ChangePasswordPayload): Promise<void> {
    return httpClient.post<void>(ENDPOINTS.AUTH_SET_PASSWORD, payload)
  }
}
