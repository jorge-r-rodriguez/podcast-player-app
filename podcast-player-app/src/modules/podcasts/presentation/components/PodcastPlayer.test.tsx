import { render, screen } from '@testing-library/react'

import { PodcastPlayer } from './PodcastPlayer'

import type { Episode } from '@/modules/podcasts/domain/entities/Episode'

describe('PodcastPlayer', () => {
  it('renders audio controls when an episode preview is available', () => {
    render(
      <PodcastPlayer
        artworkUrl="https://example.com/art.jpg"
        episode={episode}
        podcastTitle="Music Lab"
      />,
    )

    expect(screen.getByLabelText(`Audio preview for ${episode.title}`)).toHaveAttribute(
      'src',
      episode.previewUrl,
    )
  })

  it('renders an empty state when no episode is selected', () => {
    render(<PodcastPlayer artworkUrl={null} episode={null} podcastTitle="Music Lab" />)

    expect(screen.getByText(/no playable preview selected/i)).toBeInTheDocument()
  })
})

const episode: Episode = {
  artworkUrl: null,
  description: 'A useful episode.',
  durationMillis: 1800000,
  id: 'episode-1',
  podcastId: 'podcast-1',
  previewUrl: 'https://example.com/audio.mp3',
  releaseDate: '2026-01-01T00:00:00Z',
  title: 'Building better podcasts',
}
