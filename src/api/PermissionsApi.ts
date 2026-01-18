import type { PermissionDetail } from '@/types/auth'
import { httpClient, unwrapList } from './HttpClient'
import { ENDPOINTS } from './endpoints'

export interface PermissionCreatePayload {
  name: string
  codename: string
  content_type: number
}

export interface PermissionUpdatePayload {
  name?: string
  codename?: string
  content_type?: number
}

export class PermissionsApi {
  static async list(signal?: AbortSignal): Promise<PermissionDetail[]> {
    const data = await httpClient.get<PermissionDetail[] | { results?: PermissionDetail[] }>(
      ENDPOINTS.PERMISSIONS,
      undefined,
      signal
    )
    return unwrapList(data)
  }

  static async getById(id: number, signal?: AbortSignal): Promise<PermissionDetail> {
    return httpClient.get<PermissionDetail>(`${ENDPOINTS.PERMISSIONS}${id}/`, undefined, signal)
  }

  static async create(payload: PermissionCreatePayload): Promise<PermissionDetail> {
    return httpClient.post<PermissionDetail>(ENDPOINTS.PERMISSIONS, payload)
  }

  static async update(id: number, payload: PermissionUpdatePayload): Promise<PermissionDetail> {
    return httpClient.patch<PermissionDetail>(`${ENDPOINTS.PERMISSIONS}${id}/`, payload)
  }

  static async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`${ENDPOINTS.PERMISSIONS}${id}/`)
  }
}
