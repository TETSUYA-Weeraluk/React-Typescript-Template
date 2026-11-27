import { z } from 'zod'

import { messages, requiredString } from '@/lib/validation'

export const loginSchema = z.object({
  username: requiredString(),
  // รหัสผ่านไม่ trim — ช่องว่างหัวท้ายอาจเป็นส่วนหนึ่งของรหัสจริง
  password: z.string().min(1, { error: messages.required }),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
