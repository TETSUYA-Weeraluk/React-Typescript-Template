import { createFormHook } from '@tanstack/react-form'

import { CheckboxField } from '@/components/form/checkbox-field'
import { NumberField } from '@/components/form/number-field'
import { PasswordField } from '@/components/form/password-field'
import { SelectField } from '@/components/form/select-field'
import { SubmitButton } from '@/components/form/submit-button'
import { SwitchField } from '@/components/form/switch-field'
import { TextField } from '@/components/form/text-field'
import { TextareaField } from '@/components/form/textarea-field'
import { fieldContext, formContext } from '@/lib/form-context'

/**
 * ฟอร์มทั้งแอปใช้ `useAppForm` ตัวนี้ตัวเดียว — field component ถูกผูกไว้แล้ว เรียกใช้แบบ
 * `<form.AppField name="email">{(field) => <field.TextField label="Email" />}</form.AppField>`
 * เพิ่ม field ชนิดใหม่: สร้าง component ใน src/components/form แล้วลงทะเบียนที่นี่
 */
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    TextareaField,
    NumberField,
    SelectField,
    CheckboxField,
    SwitchField,
  },
  formComponents: {
    SubmitButton,
  },
})
