import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'

import { userQueryOptions } from '../api/users.queries'
import { DeleteUserDialog } from '../components/delete-user-dialog'
import { UserRoleBadge, UserStatusBadge } from '../components/user-badges'
import { UserFormDialog } from '../components/user-form-dialog'

const routeApi = getRouteApi('/_authenticated/users/$userId')

export function UserDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = routeApi.useParams()
  // loader ของ route โหลดไว้แล้ว — useSuspenseQuery จึงได้ data ทันที และยัง subscribe การเปลี่ยนแปลงของ cache
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const details = [
    { label: t('users.fields.email'), value: user.email },
    { label: t('users.fields.role'), value: <UserRoleBadge role={user.role} /> },
    { label: t('users.fields.status'), value: <UserStatusBadge isActive={user.is_active} /> },
    { label: t('users.fields.created_at'), value: formatDateTime(user.created_at) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/users">
            <ArrowLeftIcon data-icon="inline-start" />
            {t('common.back')}
          </Link>
        </Button>
      </div>

      <PageHeader
        title={user.name}
        description={t('users.detail_title')}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              <PencilIcon data-icon="inline-start" />
              {t('common.edit')}
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Trash2Icon data-icon="inline-start" />
              {t('common.delete')}
            </Button>
          </>
        }
      />

      <Card>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label} className="space-y-1">
                <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                <dd className="font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <UserFormDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={user} />
      <DeleteUserDialog
        user={isDeleteOpen ? user : null}
        onOpenChange={setIsDeleteOpen}
        // replace: กด back แล้วไม่ย้อนกลับมาหน้าของผู้ใช้ที่ลบไปแล้ว
        onDeleted={() => void navigate({ to: '/users', replace: true })}
      />
    </div>
  )
}
