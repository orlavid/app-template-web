import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ContactForm } from './ContactForm'

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'Hello from the test suite.')
}

describe('ContactForm', () => {
  it('submits trimmed, valid values and announces success', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello from the test suite.',
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Message sent. Thank you, Ada Lovelace.')
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('shows field errors and does not submit when the form is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Use 10 characters or more.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('announces a failure when the submit handler rejects', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('network down'))
    render(<ContactForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('status')).toHaveTextContent('The message was not sent. Try again.')
    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
  })
})
