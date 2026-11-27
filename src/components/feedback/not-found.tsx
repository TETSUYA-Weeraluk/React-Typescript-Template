import { Link } from '@tanstack/react-router'
import { FileQuestionIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

interface NotFoundProps {
  title?: string
  description?: string
  variant?: 'full' | 'content'
}

export function NotFound({ title, description, variant = 'content' }: NotFoundProps) {
  const { t } = useTranslation()

  return (
    <Empty className={cn(variant === 'full' ? 'min-h-dvh' : 'min-h-[60vh]')}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon />
        </EmptyMedia>
        <EmptyTitle>{title ?? t('error.not_found.title')}</EmptyTitle>
        <EmptyDescription>{description ?? t('error.not_found.description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/">{t('common.back_to_home')}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
