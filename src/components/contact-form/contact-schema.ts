import { z } from 'zod'

export const NAME_MAX_LENGTH = 80
export const MESSAGE_MIN_LENGTH = 10
export const MESSAGE_MAX_LENGTH = 1000

/**
 * One schema for the client and the server. The browser uses it through
 * react-hook-form; the server MUST call `parseContact` on the request body,
 * because client-side validation is a convenience, not a control.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter your name.')
    .max(NAME_MAX_LENGTH, `Use ${NAME_MAX_LENGTH} characters or fewer.`),
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, `Use ${MESSAGE_MIN_LENGTH} characters or more.`)
    .max(MESSAGE_MAX_LENGTH, `Use ${MESSAGE_MAX_LENGTH} characters or fewer.`),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactValues = z.output<typeof contactSchema>

/** Server-side entry point: validates untrusted input with the same rules. */
export function parseContact(input: unknown) {
  return contactSchema.safeParse(input)
}
