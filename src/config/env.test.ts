import { describe, expect, it } from 'vitest'

import { parseEnv } from './env'

const baseEnv = { BASE_URL: '/', MODE: 'test', DEV: true, PROD: false, SSR: false } as const

describe('parseEnv', () => {
  it('accepts a valid API url', () => {
    const result = parseEnv({ ...baseEnv, VITE_API_URL: 'https://api.example.com/v1/', VITE_ENABLE_MOCKS: 'true' })
    expect(result).toEqual({ ok: true, env: { apiUrl: 'https://api.example.com/v1/', enableMocks: true } })
  })

  it('reports a missing API url', () => {
    const result = parseEnv({ ...baseEnv, VITE_API_URL: '' })
    expect(result.ok).toBe(false)
  })

  it('requires a trailing slash so relative paths resolve correctly', () => {
    const result = parseEnv({ ...baseEnv, VITE_API_URL: 'https://api.example.com/v1' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]).toContain('"/"')
  })
})
