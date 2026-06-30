import { describe, expect, it } from 'vitest'
import { getApiErrorMessage, getApiErrorStatus } from './error-message'

describe('getApiErrorStatus', () => {
  it('returns the status code when present', () => {
    expect(getApiErrorStatus({ status: 403 })).toBe(403)
  })

  it('returns null when status is missing', () => {
    expect(getApiErrorStatus({ message: 'Missing' })).toBeNull()
  })
})

describe('getApiErrorMessage', () => {
  it('uses safe session-expired messaging for 401 responses', () => {
    expect(getApiErrorMessage({ status: 401 }, 'Fallback')).toBe(
      'Your session has expired. Please sign in again to continue.'
    )
  })

  it('formats backend field validation details', () => {
    expect(
      getApiErrorMessage(
        {
          status: 400,
          message: 'Validation failed',
          details: {
            base_unit: ['This field is required.'],
          },
        },
        'Fallback'
      )
    ).toBe('Base Unit: This field is required.')
  })

  it('falls back to the supplied message when details are not usable', () => {
    expect(
      getApiErrorMessage(
        {
          status: 500,
          message: 'An error occurred',
          details: {
            traceback: ['secret stack'],
          },
        },
        'Purchase was saved, but stock receiving failed.'
      )
    ).toBe('Purchase was saved, but stock receiving failed.')
  })
})
