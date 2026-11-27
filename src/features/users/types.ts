import type { UserRole } from '@/features/auth/types'

export type { UserRole }

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface UserStats {
  total: number
  active: number
  admins: number
}

export type CreateUserRequest = Pick<User, 'name' | 'email' | 'role' | 'is_active'>

export type UpdateUserRequest = Partial<CreateUserRequest>
