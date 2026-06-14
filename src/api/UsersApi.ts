import type { User, UserAccess } from '@/types/auth'
import { httpClient, unwrapList } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface UserCreatePayload {
  username: string
  email: string
  password: string
  roles?: number[]
  direct_permissions?: number[]
}

export interface UserUpdatePayload {
  username?: string
  email?: string
  roles?: number[]
  direct_permissions?: number[]
}

export interface UsersListParams {
  search?: string
  ordering?: string
}

export class UsersApi {
  static async list(params?: UsersListParams, signal?: AbortSignal): Promise<User[]> {
    const data = await httpClient.get<User[] | { results?: User[] }>(ENDPOINTS.USERS, params as Record<string, string>, signal)
    return unwrapList(data)
  }

  static async getById(id: string, signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>(`${ENDPOINTS.USERS}${id}/`, undefined, signal)
  }

  static async getAccess(id: string, signal?: AbortSignal): Promise<UserAccess> {
    return httpClient.get<UserAccess>(`${ENDPOINTS.USERS}${id}/access/`, undefined, signal)
  }

  static async create(payload: UserCreatePayload): Promise<User> {
    return httpClient.post<User>(ENDPOINTS.USERS, payload)
  }

  static async update(id: string, payload: UserUpdatePayload): Promise<User> {
    return httpClient.patch<User>(`${ENDPOINTS.USERS}${id}/`, payload)
  }

  static async updateRoles(id: string, roleIds: number[]): Promise<UserAccess> {
    return httpClient.put<UserAccess>(`${ENDPOINTS.USERS}${id}/roles/`, { role_ids: roleIds })
  }

  static async updateDirectPermissions(id: string, permissionIds: number[]): Promise<UserAccess> {
    return httpClient.put<UserAccess>(`${ENDPOINTS.USERS}${id}/permissions/`, { permission_ids: permissionIds })
  }

  static async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.USERS}${id}/`)
  }
}
