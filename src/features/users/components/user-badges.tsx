import type { UserRole } from '../types'

import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'

const ROLE_VARIANT = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline',
} as const satisfies Record<UserRole, 'default' | 'secondary' | 'outline'>

export function UserRoleBadge({ role }: { role: UserRole }) {
  const { t } = useTranslation()
  return <Badge variant={ROLE_VARIANT[role]}>{t(`users.role.${role}`)}</Badge>
}

export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={isActive ? 'size-1.5 rounded-full bg-success' : 'size-1.5 rounded-full bg-muted-foreground'}
        aria-hidden="true"
      />
      {isActive ? t('users.status.active') : t('users.status.inactive')}
    </Badge>
  )
}
