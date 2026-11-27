import type { CurrentUser } from '@/features/auth/types'
import type { User, UserRole } from '@/features/users/types'

/**
 * ฐานข้อมูลจำลองในหน่วยความจำ — รีเซ็ตเมื่อ reload หน้า (dev) หรือเรียก resetMockDb() (test)
 */
const FIRST_NAMES = [
  'สมชาย',
  'สมหญิง',
  'Anan',
  'Kanya',
  'Niran',
  'Pim',
  'Somsak',
  'Wipa',
  'Chai',
  'Malee',
  'Tawan',
  'Dao',
]
const LAST_NAMES = ['ใจดี', 'รักเรียน', 'Srisuk', 'Boonmee', 'Chaiyo', 'Thongdee']
const ROLES: UserRole[] = ['admin', 'editor', 'viewer', 'viewer']

const createSeedUsers = (): User[] =>
  Array.from({ length: 36 }, (_, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length] ?? 'User'
    const lastName = LAST_NAMES[index % LAST_NAMES.length] ?? String(index)
    const createdAt = new Date(Date.UTC(2026, 0, 1 + index * 7, 9, 30))

    return {
      id: `user-${index + 1}`,
      name: `${firstName} ${lastName}`,
      email: `user${index + 1}@example.com`,
      role: ROLES[index % ROLES.length] ?? 'viewer',
      is_active: index % 5 !== 0,
      created_at: createdAt.toISOString(),
    }
  })

export const mockCurrentUser: CurrentUser = {
  id: 'me',
  username: 'admin',
  name: 'Admin Demo',
  email: 'admin@example.com',
  role: 'admin',
}

export const mockDb = {
  users: createSeedUsers(),
}

export const resetMockDb = () => {
  mockDb.users = createSeedUsers()
}
