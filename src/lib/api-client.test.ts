import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { env } from '@/config/env'
import { server } from '@/mocks/server'
import { useAuthStore } from '@/stores/auth-store'

import { apiClient, TOKEN_REFRESH_PATH } from './api-client'

const url = (path: string) => new URL(path, env.apiUrl).toString()

/** endpoint ทดสอบ: ผ่านเฉพาะ token ใหม่ */
const protectedEndpoint = http.get(url('protected/'), ({ request }) =>
  request.headers.get('Authorization') === 'Bearer new-access'
    ? HttpResponse.json({ ok: true })
    : HttpResponse.json({ message: 'expired' }, { status: 401 })
)

describe('apiClient token refresh', () => {
  it('attaches the access token to requests', async () => {
    useAuthStore.getState().setTokens({ accessToken: 'new-access', refreshToken: 'refresh' })
    server.use(protectedEndpoint)

    await expect(apiClient.get('protected/')).resolves.toMatchObject({ data: { ok: true } })
  })

  it('refreshes once for many concurrent 401s, then retries every request', async () => {
    let refreshCalls = 0
    useAuthStore.getState().setTokens({ accessToken: 'old-access', refreshToken: 'refresh' })
    server.use(
      protectedEndpoint,
      http.post(url(TOKEN_REFRESH_PATH), () => {
        refreshCalls += 1
        return HttpResponse.json({ success: true, message: 'ok', code: 'ok', data: { access: 'new-access' } })
      })
    )

    const responses = await Promise.all([
      apiClient.get('protected/'),
      apiClient.get('protected/'),
      apiClient.get('protected/'),
    ])

    expect(refreshCalls).toBe(1)
    expect(responses.map((response) => response.status)).toEqual([200, 200, 200])
    // backend ไม่ได้ส่ง refresh ใหม่มา → ต้องเก็บตัวเดิมไว้
    expect(useAuthStore.getState()).toMatchObject({ accessToken: 'new-access', refreshToken: 'refresh' })
  })

  it('clears the session and rejects every waiting request when refresh fails', async () => {
    useAuthStore.getState().setTokens({ accessToken: 'old-access', refreshToken: 'expired-refresh' })
    server.use(
      protectedEndpoint,
      http.post(url(TOKEN_REFRESH_PATH), () => HttpResponse.json({ message: 'invalid' }, { status: 401 }))
    )

    const results = await Promise.allSettled([apiClient.get('protected/'), apiClient.get('protected/')])

    expect(results.every((result) => result.status === 'rejected')).toBe(true)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('never refreshes for public endpoints', async () => {
    let refreshCalls = 0
    server.use(
      http.post(url('public/'), () => HttpResponse.json({ message: 'nope' }, { status: 401 })),
      http.post(url(TOKEN_REFRESH_PATH), () => {
        refreshCalls += 1
        return HttpResponse.json({})
      })
    )
    useAuthStore.getState().setTokens({ accessToken: 'a', refreshToken: 'r' })

    await expect(apiClient.post('public/', {}, { skipAuth: true })).rejects.toThrow()
    expect(refreshCalls).toBe(0)
  })
})
