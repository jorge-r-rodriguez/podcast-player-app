import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders an alert and calls retry', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    render(<ErrorState description="Network error" onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Network error')

    await user.click(screen.getByRole('button', { name: /retry/i }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
