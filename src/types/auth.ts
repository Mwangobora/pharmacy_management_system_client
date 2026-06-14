export interface PermissionDetail {
  id: number
  name: string
  codename: string
  module?: string
  resource?: string
  action?: string
  description?: string
  is_active?: boolean
  is_system?: boolean
}

export interface RoleSummary {
  id: number
  name: string
  code: string
}

export interface RoleDetail extends RoleSummary {
  description?: string
  permissions: number[]
  permissions_detail: PermissionDetail[]
  permission_count?: number
  user_count?: number
  is_active: boolean
  is_system?: boolean
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  role?: number | null
  role_name?: string | null
  role_detail?: RoleDetail | null
  roles?: number[]
  roles_detail?: RoleSummary[]
  direct_permissions?: number[]
  direct_permissions_detail?: PermissionDetail[]
  permissions?: string[]
  authorization_version?: number
  is_active: boolean
  is_staff: boolean
  created_at: string
}

export interface UserAccess {
  id: string
  username: string
  email: string
  roles: RoleDetail[]
  inherited_permissions: PermissionDetail[]
  direct_permissions: PermissionDetail[]
  effective_permissions: string[]
  authorization_version: number
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
  user?: User
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
