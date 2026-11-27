import { HomeIcon, RotateCcwIcon, TriangleAlertIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

interface ErrorFallbackProps {
  error?: unknown
  onRetry?: () => void
  /** full = เต็มจอ (ใช้นอก layout), content = อยู่ในพื้นที่เนื้อหาของ layout */
  variant?: 'full' | 'content'
}

export function ErrorFallback({ error, onRetry, variant = 'content' }: ErrorFallbackProps) {
  const { t } = useTranslation()
  const message = error instanceof Error ? error.message : null

  return (
    <Empty className={cn(variant === 'full' ? 'min-h-dvh' : 'min-h-[60vh]')}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>{t('error.fallback.title')}</EmptyTitle>
        <EmptyDescription>{t('error.fallback.description')}</EmptyDescription>
      </EmptyHeader>

      {/* แสดงรายละเอียด error เฉพาะตอน dev — production ไม่ควรเผย stack/ข้อความภายในให้ผู้ใช้เห็น */}
      {import.meta.env.DEV && message && (
        <pre className="max-w-lg overflow-x-auto rounded-lg border bg-muted/50 p-3 text-left text-xs text-destructive">
          {message}
        </pre>
      )}

      <EmptyContent className="flex-row justify-center">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RotateCcwIcon data-icon="inline-start" />
            {t('common.try_again')}
          </Button>
        )}
        {/* ใช้ <a> ธรรมดา (full reload) เพราะ error อาจมาจาก router เอง */}
        <Button asChild>
          <a href="/">
            <HomeIcon data-icon="inline-start" />
            {t('common.back_to_home')}
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
