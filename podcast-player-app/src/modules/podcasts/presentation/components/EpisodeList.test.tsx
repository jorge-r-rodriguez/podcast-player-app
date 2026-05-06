import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EpisodeList } from './EpisodeList'

import type { Episode } from '@/modules/podcasts/domain/entities/Episode'

describe('EpisodeList', () => {
  it('renders episodes and notifies selection', async () => {
    const user = userEvent.setup()
    const onSelectEpisode = jest.fn()

    render(
      <EpisodeList
        episodes={episodes}
        onSelectEpisode={onSelectEpisode}
        selectedEpisodeId={null}
      />,
    )

    expect(screen.getByRole('heading', { name: episodes[0]!.title })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Play ${episodes[0]!.title}` }))

    expect(onSelectEpisode).toHaveBeenCalledWith(episodes[0])
  })

  it('disables playback when an episode has no preview', () => {
    render(
      <EpisodeList
        episodes={[{ ...episodes[0]!, previewUrl: null }]}
        onSelectEpisode={jest.fn()}
        selectedEpisodeId={null}
      />,
    )

    expect(screen.getByRole('button', { name: `Play ${episodes[0]!.title}` })).toBeDisabled()
  })
})

const episodes: Episode[] = [
  {
    artworkUrl: 'https://example.com/art.jpg',
    description: 'A useful episode.',
    durationMillis: 1800000,
    id: 'episode-1',
    podcastId: 'podcast-1',
    previewUrl: 'https://example.com/audio.mp3',
    releaseDate: '2026-01-01T00:00:00Z',
    title: 'Building better podcasts',
  },
]
