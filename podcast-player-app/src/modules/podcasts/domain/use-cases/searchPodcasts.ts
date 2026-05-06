import type {
  PodcastRepository,
  SearchPodcastsParams,
} from '@/modules/podcasts/domain/repositories/PodcastRepository'

const DEFAULT_SEARCH_LIMIT = 50

export async function searchPodcasts(repository: PodcastRepository, params: SearchPodcastsParams) {
  const normalizedTerm = params.term.trim()

  if (normalizedTerm.length < 2) {
    return []
  }

  return repository.search({
    limit: params.limit ?? DEFAULT_SEARCH_LIMIT,
    term: normalizedTerm,
  })
}
