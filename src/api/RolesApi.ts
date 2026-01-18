import type { RoleDetail } from '@/types/auth'
import { httpClient } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface RoleCreatePayload {
  name: string
  permissions: number[]
  is_active?: boolean
}

export interface RoleUpdatePayload {
  name?: string
  permissions?: number[]
  is_active?: boolean
}

export class RolesApi {
  static async list(signal?: AbortSignal): Promise<RoleDetail[]> {
    return httpClient.get<RoleDetail[]>(ENDPOINTS.ROLES, undefined, signal)
  }

  static async getById(id: number, signal?: AbortSignal): Promise<RoleDetail> {
    return httpClient.get<RoleDetail>(`${ENDPOINTS.ROLES}${id}/`, undefined, signal)
  }

  static async create(payload: RoleCreatePayload): Promise<RoleDetail> {
    return httpClient.post<RoleDetail>(ENDPOINTS.ROLES, payload)
  }

  static async update(id: number, payload: RoleUpdatePayload): Promise<RoleDetail> {
    return httpClient.patch<RoleDetail>(`${ENDPOINTS.ROLES}${id}/`, payload)
  }

  static async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.ROLES}${id}/`)
  }
}
