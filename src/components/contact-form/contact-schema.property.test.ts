import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  NAME_MAX_LENGTH,
  parseContact,
} from './contact-schema'

// Property-based (fuzz) tests: fast-check generates many inputs per property
// and shrinks any failure to a minimal counterexample.

const nonBlank = (min: number, max: number) =>
  fc.string({ minLength: min, maxLength: max }).filter((s) => s.trim().length >= min)

const label = fc.stringMatching(/^[a-z0-9]{1,20}$/)
const email = fc
  .tuple(label, label, fc.stringMatching(/^[a-z]{2,6}$/))
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`)
const padding = fc.stringMatching(/^[ \t\n]{0,5}$/)

const validContact = fc.record({
  name: nonBlank(1, NAME_MAX_LENGTH),
  email,
  message: nonBlank(MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH),
})

describe('parseContact properties', () => {
  it('never throws, whatever the input', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(typeof parseContact(input).success).toBe('boolean')
      }),
    )
  })

  it('never throws on objects with arbitrary string fields', () => {
    fc.assert(
      fc.property(
        fc.record({ name: fc.string(), email: fc.string(), message: fc.string() }),
        (input) => {
          expect(typeof parseContact(input).success).toBe('boolean')
        },
      ),
    )
  })

  it('accepts valid input and returns the trimmed values', () => {
    fc.assert(
      fc.property(validContact, padding, padding, (input, before, after) => {
        const padded = {
          name: `${before}${input.name}${after}`,
          email: `${before}${input.email}${after}`,
          message: `${before}${input.message}${after}`,
        }
        const result = parseContact(padded)
        expect(result.success).toBe(true)
        expect(result.data).toEqual({
          name: input.name.trim(),
          email: input.email,
          message: input.message.trim(),
        })
      }),
    )
  })

  it('is idempotent: parsed output parses to itself', () => {
    fc.assert(
      fc.property(validContact, (input) => {
        const first = parseContact(input)
        expect(first.success).toBe(true)
        expect(parseContact(first.data).data).toEqual(first.data)
      }),
    )
  })

  it('rejects a name longer than the limit after trimming', () => {
    fc.assert(
      fc.property(validContact, nonBlank(NAME_MAX_LENGTH + 1, NAME_MAX_LENGTH + 40), (input, name) => {
        fc.pre(name.trim().length > NAME_MAX_LENGTH)
        expect(parseContact({ ...input, name }).success).toBe(false)
      }),
    )
  })

  it('rejects a message shorter than the limit after trimming', () => {
    fc.assert(
      fc.property(validContact, fc.string({ maxLength: MESSAGE_MIN_LENGTH - 1 }), padding, (input, message, pad) => {
        expect(parseContact({ ...input, message: `${pad}${message}${pad}` }).success).toBe(false)
      }),
    )
  })

  it('rejects an email without an @ sign', () => {
    fc.assert(
      fc.property(validContact, fc.string().filter((s) => !s.includes('@')), (input, bad) => {
        expect(parseContact({ ...input, email: bad }).success).toBe(false)
      }),
    )
  })
})
