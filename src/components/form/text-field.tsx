import type { BaseFieldProps } from './field-wrapper'
import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/lib/form-context'

import { FieldWrapper } from './field-wrapper'
import { getFieldErrorState, useFieldId } from './use-field-errors'

type TextFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Input>, 'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'required'>

export function TextField({ label, description, required, className, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>()
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
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-required={required}
        {...inputProps}
      />
    </FieldWrapper>
  )
}
