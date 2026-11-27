import { createFileRoute, notFound } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { NotFound } from '@/components/feedback/not-found'
import { userQueryOptions } from '@/features/users/api/users.queries'
import { UserDetailPage } from '@/features/users/pages/user-detail-page'
import { isHttpError } from '@/lib/api-error'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  loader: async ({ context, params }) => {
    try {
      // await — หน้า detail ไม่มีอะไรให้ดูถ้ายังไม่มีข้อมูล จึงรอให้เสร็จก่อน render
      await context.queryClient.ensureQueryData(userQueryOptions(params.userId))
    } catch (error) {
      if (isHttpError(error, 404)) throw notFound()
      throw error
    }
  },
  head: () => ({ meta: [{ title: 'User · React Template' }] }),
  notFoundComponent: UserNotFound,
  component: UserDetailPage,
})

function UserNotFound() {
  const { t } = useTranslation()
  return <NotFound title={t('users.not_found')} />
}
