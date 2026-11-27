import { format, isValid } from 'date-fns'
import { enUS, th } from 'date-fns/locale'

import i18n from '@/config/i18n'

type DateInput = Date | string | number | null | undefined

const EMPTY_VALUE = '-'

const toValidDate = (value: DateInput): Date | null => {
  if (value === null || value === undefined || value === '') return null
  const date = new Date(value)
  return isValid(date) ? date : null
}

/**
 * format วันที่ตามภาษาปัจจุบัน — ภาษาไทยใช้ปี พ.ศ. (ค.ศ. + 543)
 * @param value วันที่ (Date, ISO string หรือ timestamp)
 * @param pattern pattern ของ date-fns เช่น 'dd/MM/yyyy HH:mm'
 * @returns ข้อความวันที่ หรือ "-" ถ้าค่าว่าง/ไม่ถูกต้อง
 */
export const formatDate = (value: DateInput, pattern = 'dd/MM/yyyy'): string => {
  const date = toValidDate(value)
  if (!date) return EMPTY_VALUE

  if (i18n.language !== 'th') {
    return format(date, pattern, { locale: enUS })
  }

  // แทน token ปีด้วยปี พ.ศ. แบบ literal (ใส่ '' ครอบ) เพื่อไม่ให้ date-fns ตีความซ้ำ
  const buddhistYear = date.getFullYear() + 543
  const thaiPattern = pattern
    .replace(/yyyy/g, `'${buddhistYear}'`)
    .replace(/yy/g, `'${String(buddhistYear).slice(-2)}'`)

  return format(date, thaiPattern, { locale: th })
}

export const formatDateTime = (value: DateInput) => formatDate(value, 'dd/MM/yyyy HH:mm')

export const formatNumber = (value: number | null | undefined, options?: Intl.NumberFormatOptions) => {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY_VALUE
  return new Intl.NumberFormat(i18n.language === 'th' ? 'th-TH' : 'en-US', options).format(value)
}
