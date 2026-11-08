import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('lists a sent message in the table', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Contact us' })).toBeInTheDocument()
    expect(screen.getByText('No messages yet.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Grace Hopper')
    await user.type(screen.getByLabelText('Email'), 'grace@example.com')
    await user.type(screen.getByLabelText('Message'), 'A longer test message.')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    const table = screen.getByRole('table')
    expect(await within(table).findByText('Grace Hopper')).toBeInTheDocument()
    expect(within(table).getByText('grace@example.com')).toBeInTheDocument()
  })
})
