import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/config/env'
import { MOCK_CREDENTIALS } from '@/mocks/constants'

import { LoginForm } from '../components/login-form'

interface LoginPageProps {
  redirectTo?: string
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const { t } = useTranslation()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t('auth.login.title')}</CardTitle>
        <CardDescription>{t('auth.login.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm redirectTo={redirectTo} />
      </CardContent>
      {import.meta.env.DEV && env.enableMocks && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">{t('auth.login.mock_hint', MOCK_CREDENTIALS)}</p>
        </CardFooter>
      )}
    </Card>
  )
}
