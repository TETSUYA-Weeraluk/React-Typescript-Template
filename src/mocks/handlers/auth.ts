import { delay, http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { MOCK_CREDENTIALS } from '../constants'
import { mockCurrentUser } from '../db'

const api = (path: string) => new URL(path, env.apiUrl).toString()

/** access token หมดอายุไว ๆ (2 นาที) เพื่อให้เห็น flow refresh token ทำงานจริงตอน dev */
export const ACCESS_TOKEN_TTL_MS = 2 * 60_000

const issueTokens = () => {
  const issuedAt = Date.now()
  return { access: `mock-access.${issuedAt}`, refresh: `mock-refresh.${issuedAt}` }
}

const isAccessTokenValid = (authorization: string | null) => {
  const issuedAt = Number(authorization?.replace('Bearer mock-access.', ''))
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < ACCESS_TOKEN_TTL_MS
}

export const unauthorized = () =>
  HttpResponse.json(
    { success: false, message: 'Token is invalid or expired', code: 'token_not_valid' },
    { status: 401 }
  )

/** ใช้ใน handler อื่น: คืน response 401 ถ้า token ไม่ถูกต้อง */
export const requireAuth = (request: Request) =>
  isAccessTokenValid(request.headers.get('Authorization')) ? null : unauthorized()

export const authHandlers = [
  http.post(api('auth/login/'), async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as { username?: string; password?: string }

    if (body.username !== MOCK_CREDENTIALS.username || body.password !== MOCK_CREDENTIALS.password) {
      return HttpResponse.json(
        { success: false, message: 'Invalid username or password', code: 'invalid_credentials' },
        { status: 400 }
      )
    }

    return HttpResponse.json({ success: true, message: 'ok', code: 'ok', data: issueTokens() })
  }),

  http.post(api('auth/token/refresh/'), async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { refresh?: string }

    if (!body.refresh?.startsWith('mock-refresh.')) return unauthorized()

    return HttpResponse.json({ success: true, message: 'ok', code: 'ok', data: issueTokens() })
  }),

  http.get(api('auth/me/'), async ({ request }) => {
    await delay(200)
    return (
      requireAuth(request) ?? HttpResponse.json({ success: true, message: 'ok', code: 'ok', data: mockCurrentUser })
    )
  }),
]
