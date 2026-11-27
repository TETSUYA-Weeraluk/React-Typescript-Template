import { describe, expect, it } from 'vitest'

import { getSafeRedirect } from './safe-redirect'

describe('getSafeRedirect', () => {
  it('keeps in-app paths with query strings', () => {
    expect(getSafeRedirect('/users?page=2')).toBe('/users?page=2')
  })

  it.each(['https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', '', undefined, 123])(
    'falls back to "/" for unsafe value %s',
    (value) => {
      expect(getSafeRedirect(value)).toBe('/')
    }
  )
})
