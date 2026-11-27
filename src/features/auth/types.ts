export type UserRole = 'admin' | 'editor' | 'viewer'

export interface CurrentUser {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginTokens {
  access: string
  refresh: string
}
