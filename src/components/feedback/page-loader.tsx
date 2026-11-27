import { useTranslation } from 'react-i18next'

import { Spinner } from '@/components/ui/spinner'

/** pendingComponent มาตรฐาน — router แสดงเมื่อ loader ใช้เวลาเกิน defaultPendingMs (1 วินาที) */
export function PageLoader() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[40vh] flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      {t('common.loading')}
    </div>
  )
}
