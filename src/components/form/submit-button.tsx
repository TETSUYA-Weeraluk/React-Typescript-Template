import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/lib/form-context'

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'type'>

/**
 * ปุ่ม submit ที่ผูกกับสถานะฟอร์ม: disable ระหว่างส่ง และแสดง spinner
 * ใช้ type="submit" ตามปกติ — ให้ <form onSubmit> เป็นคนเรียก form.handleSubmit() (กด Enter ก็ส่งได้)
 */
export function SubmitButton({ children, disabled, ...buttonProps }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={disabled || !canSubmit || isSubmitting} {...buttonProps}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}
