import type { BaseFieldProps } from './field-wrapper'
import type { ComponentProps } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useFieldContext } from '@/lib/form-context'

import { FieldWrapper } from './field-wrapper'
import { getFieldErrorState, useFieldId } from './use-field-errors'

type PasswordFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof InputGroupInput>, 'id' | 'name' | 'type' | 'value' | 'onChange' | 'onBlur' | 'required'>

export function PasswordField({ label, description, required, className, ...inputProps }: PasswordFieldProps) {
  const { t } = useTranslation()
  const field = useFieldContext<string>()
  const id = useFieldId(field.name)
  const { isInvalid, errors } = getFieldErrorState(field)
  const [isVisible, setIsVisible] = useState(false)

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
      <InputGroup>
        <InputGroupInput
          id={id}
          name={field.name}
          type={isVisible ? 'text' : 'password'}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          aria-required={required}
          {...inputProps}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? t('common.hide_password') : t('common.show_password')}
            aria-pressed={isVisible}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FieldWrapper>
  )
}
