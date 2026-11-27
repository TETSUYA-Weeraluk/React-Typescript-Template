import type { BaseFieldProps } from './field-wrapper'
import type { ComponentProps } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { useFieldContext } from '@/lib/form-context'

import { FieldWrapper } from './field-wrapper'
import { getFieldErrorState, useFieldId } from './use-field-errors'

type TextareaFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Textarea>, 'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'required'>

export function TextareaField({ label, description, required, className, ...textareaProps }: TextareaFieldProps) {
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
      <Textarea
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-required={required}
        {...textareaProps}
      />
    </FieldWrapper>
  )
}
