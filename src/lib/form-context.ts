import { createFormHookContexts } from '@tanstack/react-form'

// แยก context ออกจาก createFormHook (src/lib/form.ts) เพื่อตัดวง import:
// field component ใช้ useFieldContext จากที่นี่ ส่วน form.ts import field component ไปลงทะเบียน
export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()
