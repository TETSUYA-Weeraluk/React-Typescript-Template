import type { BaseFieldProps } from './field-wrapper'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/lib/form-context'

import { getFieldErrorState, useFieldId } from './use-field-errors'

export function CheckboxField({ label, description, className }: Omit<BaseFieldProps, 'required'>) {
  const field = useFieldContext<boolean>()
  const id = useFieldId(field.name)
  const { isInvalid, errors } = getFieldErrorState(field)

  return (
    <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
      <Checkbox
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      <FieldContent>
        {label != null && (
          <FieldLabel htmlFor={id} className="font-normal">
            {label}
          </FieldLabel>
        )}
        {description != null && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={errors} />
      </FieldContent>
    </Field>
  )
}
