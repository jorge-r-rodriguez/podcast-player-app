import type {
  PodcastRepository,
  SearchPodcastsParams,
} from '@/modules/podcasts/domain/repositories/PodcastRepository'
import { ITunesApiClient } from '@/modules/podcasts/infrastructure/api/iTunesApiClient'
import {
  mapPodcastDetail,
  mapPodcastSearchResults,
} from '@/modules/podcasts/infrastructure/mappers/podcastMapper'

export class ITunesPodcastRepository implements PodcastRepository {
  private readonly apiClient: ITunesApiClient

  constructor(apiClient = new ITunesApiClient()) {
    this.apiClient = apiClient
  }

  async search({ limit = 50, term }: SearchPodcastsParams) {
    const results = await this.apiClient.searchPodcasts(term, limit)

    return mapPodcastSearchResults(results)
  }

  async findById(podcastId: string) {
    const results = await this.apiClient.lookupPodcast(podcastId)

    return mapPodcastDetail(results, podcastId)
  }
}
