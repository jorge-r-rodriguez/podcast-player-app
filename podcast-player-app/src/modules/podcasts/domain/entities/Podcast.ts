import type { Episode } from './Episode'

export type Podcast = {
  id: string
  title: string
  artist: string
  description: string | null
  genre: string | null
  artworkUrl: string | null
  feedUrl: string | null
  collectionViewUrl: string | null
  releaseDate: string | null
  episodeCount: number | null
  episodes: Episode[]
}

export type PodcastSearchResult = Omit<Podcast, 'episodes'>
