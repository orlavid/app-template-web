import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { cn } from './utils'

// Property-based (fuzz) tests for the class-name merge helper.

const SIZES = ['0', '1', '2', '4', '8', 'px'] as const
const utility = fc.oneof(
  fc.constantFrom(...SIZES).map((s) => `p-${s}`),
  fc.constantFrom(...SIZES).map((s) => `m-${s}`),
  fc.constantFrom('text-sm', 'text-lg', 'font-bold', 'flex', 'grid', 'hidden', 'rounded-md'),
  fc.stringMatching(/^[a-z][a-z0-9-]{0,12}$/),
)
const classList = fc.array(utility, { maxLength: 8 }).map((parts) => parts.join(' '))
const falsy = fc.constantFrom(false, null, undefined, '')

describe('cn properties', () => {
  it('returns a normalised string: no outer or repeated spaces', () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(classList, falsy), { maxLength: 6 }), (args) => {
        const out = cn(...args)
        expect(out).toBe(out.trim())
        expect(out).not.toMatch(/\s{2,}/)
      }),
    )
  })

  it('is idempotent', () => {
    fc.assert(
      fc.property(classList, (classes) => {
        expect(cn(cn(classes))).toBe(cn(classes))
      }),
    )
  })

  it('ignores falsy arguments', () => {
    fc.assert(
      fc.property(classList, falsy, (classes, nothing) => {
        expect(cn(nothing, classes, nothing)).toBe(cn(classes))
      }),
    )
  })

  it('lets the last conflicting padding class win', () => {
    fc.assert(
      fc.property(fc.constantFrom(...SIZES), fc.constantFrom(...SIZES), (a, b) => {
        expect(cn(`p-${a}`, `p-${b}`)).toBe(`p-${b}`)
      }),
    )
  })
})
