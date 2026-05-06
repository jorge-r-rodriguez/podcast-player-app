import { render, screen } from '@testing-library/react'

import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router/AppRouter'

describe('AppRouter', () => {
  it('renders the podcast search route by default', async () => {
    render(
      <AppProviders>
        <AppRouter />
      </AppProviders>,
    )

    expect(
      await screen.findByRole('heading', { name: /discover music podcasts/i }),
    ).toBeInTheDocument()
  })
})
