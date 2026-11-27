import { describe, expect, it } from 'vitest'

import { getApiErrorMessages } from './api-error'

describe('getApiErrorMessages', () => {
  it('returns the message field when the backend sends one', () => {
    expect(getApiErrorMessages({ success: false, message: 'Token expired', code: 'x' })).toEqual(['Token expired'])
  })

  it('flattens DRF field errors into a list', () => {
    expect(getApiErrorMessages({ email: ['already exists'], name: ['required', 'too short'] })).toEqual([
      'already exists',
      'required',
      'too short',
    ])
  })

  it('reads nested object errors one level deep', () => {
    expect(getApiErrorMessages({ address: { city: ['required'] } })).toEqual(['required'])
  })

  it('handles plain strings and arrays', () => {
    expect(getApiErrorMessages('boom')).toEqual(['boom'])
    expect(getApiErrorMessages(['a', 1, 'b'])).toEqual(['a', 'b'])
  })

  it('returns an empty list for empty or unknown bodies', () => {
    expect(getApiErrorMessages(undefined)).toEqual([])
    expect(getApiErrorMessages(null)).toEqual([])
    expect(getApiErrorMessages(42)).toEqual([])
  })
})
