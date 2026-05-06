import { render, screen } from '@testing-library/react'

import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router/AppRouter'

jest.mock('@/modules/podcasts/presentation/pages/PodcastSearchPage', () => ({
  PodcastSearchPage: () => <h1>Discover music podcasts</h1>,
}))

jest.mock('@/modules/podcasts/presentation/pages/PodcastDetailPage', () => ({
  PodcastDetailPage: () => <h1>Podcast details</h1>,
}))

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
