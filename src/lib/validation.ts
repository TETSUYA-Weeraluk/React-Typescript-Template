import { z } from 'zod'

import i18n from '@/config/i18n'

/**
 * ข้อความ validation แบบแปลภาษา — ส่งเป็น function ให้ zod เรียกตอน validate
 * ข้อความจึงเป็นภาษาปัจจุบันเสมอ (ไม่ถูก freeze ตอน import schema)
 */
export const messages = {
  required: () => i18n.t('validation.required'),
  email: () => i18n.t('validation.email'),
  selectRequired: () => i18n.t('validation.select_required'),
  minLength: (count: number) => () => i18n.t('validation.min_length', { count }),
  maxLength: (count: number) => () => i18n.t('validation.max_length', { count }),
}

/** string ที่ต้องกรอก (ตัดช่องว่างหัวท้ายก่อนเช็ค) */
export const requiredString = () => z.string().trim().min(1, { error: messages.required })
