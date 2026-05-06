import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { PodcastCard } from './PodcastCard'

import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'

describe('PodcastCard', () => {
  it('renders podcast data and links to the detail route', () => {
    render(
      <MemoryRouter>
        <PodcastCard podcast={podcast} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: podcast.title })).toBeInTheDocument()
    expect(screen.getByText(podcast.artist)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open details/i })).toHaveAttribute(
      'href',
      `/podcasts/${podcast.id}`,
    )
    expect(screen.getByAltText(`${podcast.title} artwork`)).toBeInTheDocument()
  })
})

const podcast: PodcastSearchResult = {
  artist: 'The Music Lab',
  artworkUrl: 'https://example.com/artwork.jpg',
  collectionViewUrl: 'https://podcasts.apple.com/music-lab',
  description: null,
  episodeCount: 12,
  feedUrl: 'https://example.com/feed.xml',
  genre: 'Music',
  id: '123',
  releaseDate: '2026-01-01T00:00:00Z',
  title: 'Music Lab Podcast',
}
