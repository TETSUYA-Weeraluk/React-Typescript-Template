import type { ReactNode } from 'react'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'

export interface BaseFieldProps {
  label?: ReactNode
  description?: ReactNode
  required?: boolean
  className?: string
}

interface FieldWrapperProps extends BaseFieldProps {
  id: string
  isInvalid: boolean
  errors: ({ message?: string } | undefined)[]
  children: ReactNode
}

/** โครง label + input + description + error ที่ field ทุกตัวใช้ร่วมกัน */
export function FieldWrapper({
  id,
  label,
  description,
  required,
  className,
  isInvalid,
  errors,
  children,
}: FieldWrapperProps) {
  return (
    <Field data-invalid={isInvalid} className={className}>
      {label != null && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </FieldLabel>
      )}
      {children}
      {description != null && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={errors} />
    </Field>
  )
}
