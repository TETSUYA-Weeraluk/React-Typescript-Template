import type { User } from '../types'

import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useDeleteUser } from '../api/users.queries'

interface DeleteUserDialogProps {
  user: User | null
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteUserDialog({ user, onOpenChange, onDeleted }: DeleteUserDialogProps) {
  const { t } = useTranslation()
  const deleteUser = useDeleteUser()

  const handleConfirm = () => {
    if (!user) return

    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(t('users.deleted'))
        onOpenChange(false)
        onDeleted?.()
      },
    })
  }

  return (
    <AlertDialog open={user != null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('users.delete_title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('users.delete_description', { name: user?.name ?? '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>{t('common.cancel')}</AlertDialogCancel>
          {/* ใช้ Button ธรรมดาแทน AlertDialogAction เพราะ Action จะปิด dialog ทันทีก่อนลบเสร็จ */}
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteUser.isPending}>
            {deleteUser.isPending && <Spinner data-icon="inline-start" />}
            {t('common.delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
