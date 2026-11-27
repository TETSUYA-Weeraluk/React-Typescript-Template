import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '@/features/auth/pages/login-page'
import { getSafeRedirect } from '@/lib/safe-redirect'
import { hasSession } from '@/stores/auth-store'

const loginSearchSchema = z.object({
  /** หน้าที่จะกลับไปหลัง login (guard ของ /_authenticated ใส่ให้) */
  redirect: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_public/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ search }) => {
    // login อยู่แล้วไม่ต้องเห็นหน้า login อีก
    if (hasSession()) {
      throw redirect({ href: getSafeRedirect(search.redirect), replace: true })
    }
  },
  head: () => ({ meta: [{ title: 'Sign in · React Template' }] }),
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect: redirectTo } = Route.useSearch()
  return <LoginPage redirectTo={redirectTo} />
}
