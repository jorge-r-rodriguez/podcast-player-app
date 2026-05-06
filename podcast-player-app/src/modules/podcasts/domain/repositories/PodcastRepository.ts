import type { Podcast, PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'

export type SearchPodcastsParams = {
  term: string
  limit?: number
}

export interface PodcastRepository {
  search(params: SearchPodcastsParams): Promise<PodcastSearchResult[]>
  findById(podcastId: string): Promise<Podcast | null>
}
