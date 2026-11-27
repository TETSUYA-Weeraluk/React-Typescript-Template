import type { AxiosError } from 'axios'

import { HttpStatusCode, isAxiosError } from 'axios'
import { toast } from 'sonner'

import i18n from '@/config/i18n'

const pickStrings = (values: unknown[]): string[] =>
  values.filter((value): value is string => typeof value === 'string')

const collectMessages = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return pickStrings(value)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((nested) =>
      typeof nested === 'string' ? [nested] : Array.isArray(nested) ? pickStrings(nested) : []
    )
  }
  return []
}

/**
 * ดึงข้อความ error ที่อ่านได้จาก body ของ backend ทุกรูปแบบที่ DRF ส่งมา เช่น
 * - `{ "message": "..." }`
 * - `{ "email": ["already exists"], "name": ["required"] }`
 * - `["error 1", "error 2"]` หรือ `"error"`
 */
export const getApiErrorMessages = (body: unknown): string[] => {
  if (!body) return []
  if (typeof body === 'string') return [body]
  if (Array.isArray(body)) return pickStrings(body)
  if (typeof body !== 'object') return []

  const record = body as Record<string, unknown>
  if (typeof record.message === 'string' && record.message.length > 0) {
    return [record.message]
  }

  return Object.values(record).flatMap(collectMessages)
}

const getFallbackMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return i18n.t('error.api.timeout')
  if (!error.response) return i18n.t('error.api.network')

  switch (error.response.status) {
    case HttpStatusCode.BadRequest:
      return i18n.t('error.api.bad_request')
    case HttpStatusCode.Forbidden:
      return i18n.t('error.api.forbidden')
    case HttpStatusCode.NotFound:
      return i18n.t('error.api.not_found')
    case HttpStatusCode.RequestTimeout:
      return i18n.t('error.api.timeout')
    default:
      return error.response.status >= 500 ? i18n.t('error.api.server') : i18n.t('error.api.default')
  }
}

export const isHttpError = (error: unknown, status: number): error is AxiosError =>
  isAxiosError(error) && error.response?.status === status

/**
 * แสดง toast เมื่อ API error
 * - 401 ไม่แสดง เพราะ interceptor + route guard จัดการ (refresh / พาไปหน้า login) แล้ว
 * - ถ้า backend ส่งข้อความมา จะแสดงข้อความนั้น ไม่งั้นใช้ข้อความตาม status
 */
export const showApiErrorToast = (error: unknown, fallbackMessage?: string) => {
  if (!isAxiosError(error)) {
    toast.error(fallbackMessage ?? i18n.t('error.api.default'))
    return
  }

  if (error.response?.status === HttpStatusCode.Unauthorized) return

  const messages = getApiErrorMessages(error.response?.data)
  const [firstMessage, ...otherMessages] = messages

  if (!firstMessage) {
    toast.error(fallbackMessage ?? getFallbackMessage(error))
    return
  }

  toast.error(firstMessage, {
    description:
      otherMessages.length > 0 ? (
        <ul className="list-disc pl-4">
          {otherMessages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : undefined,
  })
}
