export interface User {
  id: string
  username: string
  email: string
  role?: string | null
  role_name?: string | null
  role_detail?: RoleDetail | null
  is_active: boolean
  is_staff: boolean
  created_at: string
}

export interface RoleDetail {
  id: number
  name: string
  permissions: number[]
  permissions_detail: PermissionDetail[]
  is_active: boolean
}

export interface PermissionDetail {
  id: number
  name: string
  codename: string
  content_type: number
  content_type_label: string
  content_type_model: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  username: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface RefreshTokenPayload {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
}

export interface UpdateProfilePayload {
  username?: string
  email?: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}
