import { describe, expect, it } from 'vitest'

import en from './en.json'
import th from './th.json'

const collectKeys = (value: unknown, prefix = ''): string[] => {
  if (value === null || typeof value !== 'object') return [prefix]
  return Object.entries(value).flatMap(([key, nested]) => collectKeys(nested, prefix ? `${prefix}.${key}` : key))
}

describe('locales', () => {
  it('th and en define exactly the same keys', () => {
    expect(collectKeys(en).sort()).toEqual(collectKeys(th).sort())
  })
})
