import { mapPodcastDetail, mapPodcastSearchResult, mapPodcastSearchResults } from './podcastMapper'

import type { ITunesPodcastDto } from '@/modules/podcasts/infrastructure/api/iTunesApiClient'

describe('podcastMapper', () => {
  it('maps an iTunes collection to a podcast search result', () => {
    const dto: ITunesPodcastDto = {
      artistName: 'The Music Lab',
      artworkUrl100: 'https://example.com/100x100bb.jpg',
      collectionId: 123,
      collectionName: 'Music Talks',
      collectionViewUrl: 'https://podcasts.apple.com/music-talks',
      feedUrl: 'https://example.com/feed.xml',
      primaryGenreName: 'Music',
      releaseDate: '2026-01-01T00:00:00Z',
      trackCount: 24,
      wrapperType: 'track',
    }

    expect(mapPodcastSearchResult(dto)).toEqual({
      artist: 'The Music Lab',
      artworkUrl: 'https://example.com/600x600bb.jpg',
      collectionViewUrl: 'https://podcasts.apple.com/music-talks',
      description: null,
      episodeCount: 24,
      feedUrl: 'https://example.com/feed.xml',
      genre: 'Music',
      id: '123',
      releaseDate: '2026-01-01T00:00:00Z',
      title: 'Music Talks',
    })
  })

  it('filters incomplete search results', () => {
    const results = mapPodcastSearchResults([
      {
        artistName: 'Valid Artist',
        collectionId: 1,
        collectionName: 'Valid Podcast',
      },
      {
        collectionId: 2,
        collectionName: 'Missing Artist',
      },
    ])

    expect(results).toHaveLength(1)
    expect(results[0]?.title).toBe('Valid Podcast')
  })

  it('maps podcast detail with episodes', () => {
    const results: ITunesPodcastDto[] = [
      {
        artistName: 'The Music Lab',
        collectionId: 123,
        collectionName: 'Music Talks',
        primaryGenreName: 'Music',
        wrapperType: 'track',
      },
      {
        artworkUrl600: 'https://example.com/episode.jpg',
        description: 'Episode description',
        kind: 'podcast-episode',
        previewUrl: 'https://example.com/audio.mp3',
        releaseDate: '2026-01-02T00:00:00Z',
        trackId: 456,
        trackName: 'How to produce better music',
        trackTimeMillis: 1800000,
      },
    ]

    expect(mapPodcastDetail(results, '123')).toMatchObject({
      artist: 'The Music Lab',
      episodes: [
        {
          description: 'Episode description',
          durationMillis: 1800000,
          id: '456',
          podcastId: '123',
          previewUrl: 'https://example.com/audio.mp3',
          title: 'How to produce better music',
        },
      ],
      genre: 'Music',
      id: '123',
      title: 'Music Talks',
    })
  })
})
