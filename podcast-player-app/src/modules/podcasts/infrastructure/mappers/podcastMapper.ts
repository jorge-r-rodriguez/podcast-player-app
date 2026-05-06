import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import type { Podcast, PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'
import type { ITunesPodcastDto } from '@/modules/podcasts/infrastructure/api/iTunesApiClient'

const FALLBACK_ARTWORK_SIZE = '600x600bb'

export function mapPodcastSearchResult(dto: ITunesPodcastDto): PodcastSearchResult | null {
  const id = dto.collectionId?.toString()
  const title = dto.collectionName ?? dto.trackName

  if (!id || !title || !dto.artistName) {
    return null
  }

  return {
    artist: dto.artistName,
    artworkUrl: getArtworkUrl(dto),
    collectionViewUrl: dto.collectionViewUrl ?? null,
    description: getDescription(dto),
    episodeCount: dto.trackCount ?? null,
    feedUrl: dto.feedUrl ?? null,
    genre: dto.primaryGenreName ?? dto.genres?.[0] ?? null,
    id,
    releaseDate: dto.releaseDate ?? null,
    title,
  }
}

export function mapPodcastDetail(results: ITunesPodcastDto[], podcastId: string): Podcast | null {
  const collection = results.find((item) => item.wrapperType === 'track' && item.collectionId)
  const podcast = collection ? mapPodcastSearchResult(collection) : null

  if (!podcast) {
    return null
  }

  const episodes = results
    .filter((item) => item.kind === 'podcast-episode')
    .map((item) => mapEpisode(item, podcastId))
    .filter((episode): episode is Episode => episode !== null)

  return {
    ...podcast,
    episodes,
  }
}

export function mapPodcastSearchResults(results: ITunesPodcastDto[]): PodcastSearchResult[] {
  return results
    .map((item) => mapPodcastSearchResult(item))
    .filter((podcast): podcast is PodcastSearchResult => podcast !== null)
}

function mapEpisode(dto: ITunesPodcastDto, podcastId: string): Episode | null {
  const id = dto.trackId?.toString()
  const title = dto.trackName

  if (!id || !title) {
    return null
  }

  return {
    artworkUrl: getArtworkUrl(dto),
    description: getDescription(dto),
    durationMillis: dto.trackTimeMillis ?? null,
    id,
    podcastId,
    previewUrl: dto.previewUrl ?? null,
    releaseDate: dto.releaseDate ?? null,
    title,
  }
}

function getArtworkUrl(dto: ITunesPodcastDto) {
  const artworkUrl = dto.artworkUrl600 ?? dto.artworkUrl100 ?? null

  if (!artworkUrl) {
    return null
  }

  return artworkUrl.replace('100x100bb', FALLBACK_ARTWORK_SIZE)
}

function getDescription(dto: ITunesPodcastDto) {
  return dto.longDescription ?? dto.description ?? dto.shortDescription ?? null
}
