import { z } from 'zod'

import { messages, requiredString } from '@/lib/validation'

export const USER_ROLES = ['admin', 'editor', 'viewer'] as const

export const userFormSchema = z.object({
  name: requiredString().max(100, { error: messages.maxLength(100) }),
  email: z.email({ error: messages.email }),
  role: z.enum(USER_ROLES, { error: messages.selectRequired }),
  is_active: z.boolean(),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export const EMPTY_USER_FORM: UserFormValues = {
  name: '',
  email: '',
  role: 'viewer',
  is_active: true,
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

/**
 * search params ของหน้ารายการ (ใช้กับ validateSearch ของ route)
 * - state ของตาราง (หน้า/ค้นหา) อยู่ใน URL → refresh / แชร์ลิงก์ / กด back แล้วได้หน้าเดิม
 * - `.catch()` ให้ค่า default เมื่อ URL ถูกแก้มั่ว แทนการ throw error ทั้งหน้า
 */
export const usersSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
  page_size: z.coerce
    .number()
    .refine((value) => (PAGE_SIZE_OPTIONS as readonly number[]).includes(value))
    .catch(10)
    .default(10),
  search: z.string().trim().catch('').default(''),
})

export type UsersSearch = z.infer<typeof usersSearchSchema>
