import type { UserFormValues } from '../schemas/user.schema'
import type { User } from '../types'

import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

import { useCreateUser, useUpdateUser } from '../api/users.queries'
import { UserForm } from './user-form'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ไม่ส่ง = สร้างใหม่, ส่ง = แก้ไข */
  user?: User | null
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { t } = useTranslation()
  const formId = useId()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const isEditing = user != null
  const isPending = createUser.isPending || updateUser.isPending

  const handleSubmit = async (values: UserFormValues) => {
    if (isEditing) {
      await updateUser.mutateAsync({ id: user.id, body: values })
      toast.success(t('users.updated'))
    } else {
      await createUser.mutateAsync(values)
      toast.success(t('users.created'))
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('users.edit_title') : t('users.create_title')}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing ? t('users.edit_title') : t('users.create_title')}
          </DialogDescription>
        </DialogHeader>

        {/* key ทำให้ฟอร์ม mount ใหม่เมื่อเปลี่ยนผู้ใช้ → defaultValues เป็นของคนใหม่เสมอ */}
        <UserForm
          key={user?.id ?? 'new'}
          formId={formId}
          defaultValues={
            user ? { name: user.name, email: user.email, role: user.role, is_active: user.is_active } : undefined
          }
          onSubmit={async (values) => {
            try {
              await handleSubmit(values)
            } catch {
              // error ถูก toast จาก MutationCache แล้ว — กลืนไว้เพื่อให้ dialog ยังเปิดให้แก้ต่อได้
            }
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isEditing ? t('common.save') : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
