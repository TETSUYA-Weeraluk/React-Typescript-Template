import { useQuery } from '@tanstack/react-query'
import { ShieldCheckIcon, UserCheckIcon, UsersIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/auth/api/auth.queries'
import { userStatsQueryOptions } from '@/features/users/api/users.queries'
import { formatNumber } from '@/lib/format'

export function DashboardPage() {
  const { t } = useTranslation()
  const currentUser = useCurrentUser()
  const statsQuery = useQuery(userStatsQueryOptions())

  const stats = [
    { label: t('dashboard.total_users'), value: statsQuery.data?.total, icon: UsersIcon },
    { label: t('dashboard.active_users'), value: statsQuery.data?.active, icon: UserCheckIcon },
    { label: t('dashboard.admins'), value: statsQuery.data?.admins, icon: ShieldCheckIcon },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('dashboard.welcome', { name: currentUser.name })} description={t('dashboard.description')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription className="flex items-center justify-between">
                {label}
                <Icon className="size-4" aria-hidden="true" />
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {statsQuery.isPending ? <Skeleton className="h-9 w-16" /> : formatNumber(value)}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
