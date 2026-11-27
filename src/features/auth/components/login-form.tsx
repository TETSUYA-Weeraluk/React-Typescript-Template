import { useNavigate } from '@tanstack/react-router'
import { TriangleAlertIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { FieldGroup } from '@/components/ui/field'
import { isHttpError, showApiErrorToast } from '@/lib/api-error'
import { useAppForm } from '@/lib/form'
import { getSafeRedirect } from '@/lib/safe-redirect'

import { useLogin } from '../api/auth.queries'
import { loginSchema } from '../schemas/login.schema'

const REMEMBERED_USERNAME_KEY = 'app-remembered-username'

const readRememberedUsername = () => {
  try {
    return localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? ''
  } catch {
    return ''
  }
}

const saveRememberedUsername = (username: string | null) => {
  try {
    if (username) localStorage.setItem(REMEMBERED_USERNAME_KEY, username)
    else localStorage.removeItem(REMEMBERED_USERNAME_KEY)
  } catch {
    // ignore
  }
}

/** 400/401 จาก auth/login = ชื่อผู้ใช้หรือรหัสผ่านผิด — กรณีอื่น (network, 5xx) ให้ toast กลางแสดง */
const isInvalidCredentials = (error: unknown) => isHttpError(error, 400) || isHttpError(error, 401)

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false)

  const rememberedUsername = readRememberedUsername()

  const form = useAppForm({
    defaultValues: {
      username: rememberedUsername,
      password: '',
      rememberMe: rememberedUsername.length > 0,
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setHasInvalidCredentials(false)

      try {
        await loginMutation.mutateAsync({ username: value.username.trim(), password: value.password })
      } catch (error) {
        if (isInvalidCredentials(error)) {
          setHasInvalidCredentials(true)
          form.setFieldValue('password', '')
          return
        }
        showApiErrorToast(error)
        return
      }

      saveRememberedUsername(value.rememberMe ? value.username.trim() : null)
      await navigate({ href: getSafeRedirect(redirectTo), replace: true })
    },
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        {hasInvalidCredentials && (
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>{t('auth.login.invalid_credentials')}</AlertTitle>
          </Alert>
        )}

        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label={t('auth.login.username')}
              placeholder={t('auth.login.username_placeholder')}
              autoComplete="username"
              autoFocus={rememberedUsername.length === 0}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label={t('auth.login.password')}
              autoComplete="current-password"
              autoFocus={rememberedUsername.length > 0}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="rememberMe">
          {(field) => <field.CheckboxField label={t('auth.login.remember_me')} />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton className="w-full">{t('auth.login.submit')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  )
}
