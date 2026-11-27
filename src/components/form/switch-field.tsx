import type { BaseFieldProps } from './field-wrapper'

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useFieldContext } from '@/lib/form-context'

import { getFieldErrorState, useFieldId } from './use-field-errors'

export function SwitchField({ label, description, className }: Omit<BaseFieldProps, 'required'>) {
  const field = useFieldContext<boolean>()
  const id = useFieldId(field.name)
  const { isInvalid, errors } = getFieldErrorState(field)

  return (
    <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
      <FieldContent>
        {label != null && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
        {description != null && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={errors} />
      </FieldContent>
      <Switch
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
    </Field>
  )
}
