import type { BaseFieldProps } from './field-wrapper'
import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/lib/form-context'

import { FieldWrapper } from './field-wrapper'
import { getFieldErrorState, useFieldId } from './use-field-errors'

type NumberFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Input>, 'id' | 'name' | 'type' | 'value' | 'onChange' | 'onBlur' | 'required'>

/**
 * ค่าในฟอร์มเป็น `number | null` — ช่องว่างคือ null (ไม่ใช่ 0)
 * เพื่อไม่ให้ Number('') กลายเป็น 0 แล้วผ่าน validation โดยที่ผู้ใช้ไม่ได้กรอก
 */
export function NumberField({ label, description, required, className, ...inputProps }: NumberFieldProps) {
  const field = useFieldContext<number | null>()
  const id = useFieldId(field.name)
  const { isInvalid, errors } = getFieldErrorState(field)

  return (
    <FieldWrapper
      id={id}
      label={label}
      description={description}
      required={required}
      className={className}
      isInvalid={isInvalid}
      errors={errors}
    >
      <Input
        id={id}
        name={field.name}
        type="number"
        inputMode="decimal"
        value={field.state.value ?? ''}
        onChange={(event) => {
          const { value, valueAsNumber } = event.target
          field.handleChange(value === '' || Number.isNaN(valueAsNumber) ? null : valueAsNumber)
        }}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-required={required}
        {...inputProps}
      />
    </FieldWrapper>
  )
}
