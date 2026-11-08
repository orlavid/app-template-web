import { describe, expect, it } from 'vitest'

import { MESSAGE_MAX_LENGTH, NAME_MAX_LENGTH, parseContact } from './contact-schema'

const VALID = { name: 'Ada', email: 'ada@example.com', message: 'Hello there, team.' }

describe('parseContact (server-side validation)', () => {
  it('accepts valid input and trims whitespace', () => {
    const result = parseContact({ ...VALID, name: '  Ada  ' })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Ada')
  })

  it.each([
    ['a missing name', { ...VALID, name: '   ' }],
    ['a long name', { ...VALID, name: 'x'.repeat(NAME_MAX_LENGTH + 1) }],
    ['a bad email', { ...VALID, email: 'not-an-email' }],
    ['a short message', { ...VALID, message: 'short' }],
    ['a long message', { ...VALID, message: 'x'.repeat(MESSAGE_MAX_LENGTH + 1) }],
    ['a non-object body', 'name=Ada'],
  ])('rejects %s', (_label, input) => {
    expect(parseContact(input).success).toBe(false)
  })
})
