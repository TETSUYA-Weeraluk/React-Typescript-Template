import type { AnyFieldApi } from '@tanstack/react-form'

import { useId } from 'react'

/**
 * แสดง error เมื่อผู้ใช้แตะช่องนั้นแล้ว (blur/พิมพ์) หรือกด submit แล้ว
 * — TanStack Form จะ mark ทุก field เป็น touched ตอน handleSubmit ให้อัตโนมัติ
 */
export function getFieldErrorState(field: AnyFieldApi) {
  const { isTouched, isValid, errors } = field.state.meta
  const isInvalid = isTouched && !isValid

  // error จาก Standard Schema (zod) เป็น object ที่มี message; error จาก validator ที่เขียนเองอาจเป็น string
  const fieldErrors = (errors as unknown[]).map((error) =>
    typeof error === 'string' ? { message: error } : (error as { message?: string } | undefined)
  )

  return { isInvalid, errors: isInvalid ? fieldErrors : [] }
}

/** id ไม่ซ้ำต่อ field — ใช้แค่ชื่อ field (เช่น "email") จะชนกันเมื่อมีสองฟอร์มในหน้าเดียว */
export function useFieldId(name: string) {
  return `${useId()}-${name}`
}
