import type { UserFormValues } from '../schemas/user.schema'
import type { Option } from '@/types/api'

import { useTranslation } from 'react-i18next'

import { FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/lib/form'

import { EMPTY_USER_FORM, USER_ROLES, userFormSchema } from '../schemas/user.schema'

interface UserFormProps {
  /**
   * id ของ <form> — ปุ่ม submit ที่อยู่นอกฟอร์ม (เช่น ใน DialogFooter) ผูกด้วย `form={formId}`
   * ปุ่มนั้นนับเป็น default button ของฟอร์ม จึงกด Enter ในช่องกรอกเพื่อส่งได้ตามปกติ
   */
  formId: string
  defaultValues?: UserFormValues
  onSubmit: (values: UserFormValues) => Promise<void>
}

export function UserForm({ formId, defaultValues = EMPTY_USER_FORM, onSubmit }: UserFormProps) {
  const { t } = useTranslation()

  const roleOptions: Option[] = USER_ROLES.map((role) => ({ value: role, label: t(`users.role.${role}`) }))

  const form = useAppForm({
    defaultValues,
    validators: {
      // validate ตอนพิมพ์ด้วย เพื่อให้ error หายทันทีเมื่อแก้ถูก (แสดงเฉพาะช่องที่แตะแล้ว)
      onChange: userFormSchema,
      onSubmit: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(userFormSchema.parse(value))
    },
  })

  return (
    <form
      id={formId}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => <field.TextField label={t('users.fields.name')} autoComplete="name" required />}
        </form.AppField>

        <form.AppField name="email">
          {(field) => <field.TextField label={t('users.fields.email')} type="email" autoComplete="email" required />}
        </form.AppField>

        <form.AppField name="role">
          {(field) => <field.SelectField label={t('users.fields.role')} options={roleOptions} required />}
        </form.AppField>

        <form.AppField name="is_active">
          {(field) => <field.SwitchField label={t('users.fields.is_active')} />}
        </form.AppField>
      </FieldGroup>
    </form>
  )
}
