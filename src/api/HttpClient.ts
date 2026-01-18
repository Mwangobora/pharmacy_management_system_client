import { useAuthStore } from '@/store/authStore'
import { ENDPOINTS } from './endpoints'

export interface ApiError {
  message: string
  status: number
  details?: Record<string, string[]>
}

class HttpClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000'
  }

  private getAuthHeaders(): HeadersInit {
    const tokens = useAuthStore.getState().tokens
    return tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshToken()
        if (!refreshed) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
      const error = await response.json().catch(() => ({}))
      throw {
        message: error.detail || error.message || 'An error occurred',
        status: response.status,
        details: error,
      } as ApiError
    }
    if (response.status === 204) return {} as T
    return response.json()
  }

  private async refreshToken(): Promise<boolean> {
    const tokens = useAuthStore.getState().tokens
    if (!tokens?.refresh) return false

    try {
      const response = await fetch(`${this.baseUrl}${ENDPOINTS.AUTH_REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      })
      if (!response.ok) return false
      const data = await response.json()
      useAuthStore.getState().updateAccessToken(data.access)
      return true
    } catch {
      return false
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>, signal?: AbortSignal): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') url.searchParams.append(key, value)
      })
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      signal,
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      signal,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      signal,
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      signal,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      signal,
    })
    return this.handleResponse<T>(response)
  }
}

export const httpClient = new HttpClient()
