import type { BaseFieldProps } from './field-wrapper'
import type { Option } from '@/types/api'

import { useTranslation } from 'react-i18next'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFieldContext } from '@/lib/form-context'

import { FieldWrapper } from './field-wrapper'
import { getFieldErrorState, useFieldId } from './use-field-errors'

interface SelectFieldProps extends BaseFieldProps {
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

export function SelectField({
  label,
  description,
  required,
  className,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  const { t } = useTranslation()
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
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
        onOpenChange={(isOpen) => {
          // Select ไม่มี blur event ของ input จริง — ถือว่าปิด dropdown = blur
          if (!isOpen) field.handleBlur()
        }}
      >
        <SelectTrigger id={id} aria-invalid={isInvalid} aria-required={required} className="w-full">
          <SelectValue placeholder={placeholder ?? t('common.select_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  )
}
