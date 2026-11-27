import { afterEach, describe, expect, it } from 'vitest'

import i18n from '@/config/i18n'

import { formatDate, formatDateTime } from './format'

describe('formatDate', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('uses the Buddhist year in Thai', async () => {
    await i18n.changeLanguage('th')
    expect(formatDate(new Date(2026, 10, 27))).toBe('27/11/2569')
  })

  it('uses the Gregorian year in English', () => {
    expect(formatDateTime(new Date(2026, 10, 27, 9, 5))).toBe('27/11/2026 09:05')
  })

  it('returns "-" for empty or invalid values', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('not-a-date')).toBe('-')
  })
})
