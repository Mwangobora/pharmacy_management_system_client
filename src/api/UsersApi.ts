import type { User } from '@/types/auth'
import { httpClient } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface UserCreatePayload {
  username: string
  email: string
  password: string
  role?: number
}

export interface UserUpdatePayload {
  username?: string
  email?: string
  role?: number
}

export interface UsersListParams {
  search?: string
  ordering?: string
}

export class UsersApi {
  static async list(params?: UsersListParams, signal?: AbortSignal): Promise<User[]> {
    return httpClient.get<User[]>(ENDPOINTS.USERS, params as Record<string, string>, signal)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>(`${ENDPOINTS.USERS}${id}/`, undefined, signal)
  }

  static async create(payload: UserCreatePayload): Promise<User> {
    return httpClient.post<User>(ENDPOINTS.USERS, payload)
  }

  static async update(id: string, payload: UserUpdatePayload): Promise<User> {
    return httpClient.patch<User>(`${ENDPOINTS.USERS}${id}/`, payload)
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.USERS}${id}/`)
  }
}
