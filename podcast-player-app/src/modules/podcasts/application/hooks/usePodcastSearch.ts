import { useQuery } from '@tanstack/react-query'

import { podcastRepository } from '@/modules/podcasts/application/services/podcastService'
import { searchPodcasts } from '@/modules/podcasts/domain/use-cases/searchPodcasts'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { podcastQueryKeys } from './podcastQueryKeys'

type UsePodcastSearchParams = {
  term: string
  limit?: number
}

const MIN_SEARCH_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 450

export function usePodcastSearch({ limit = 50, term }: UsePodcastSearchParams) {
  const debouncedTerm = useDebounce(term, SEARCH_DEBOUNCE_MS)
  const normalizedTerm = debouncedTerm.trim()
  const isSearchEnabled = normalizedTerm.length >= MIN_SEARCH_LENGTH

  const query = useQuery({
    enabled: isSearchEnabled,
    queryFn: () => searchPodcasts(podcastRepository, { limit, term: normalizedTerm }),
    queryKey: podcastQueryKeys.search(normalizedTerm, limit),
    staleTime: 1000 * 60 * 10,
  })

  return {
    ...query,
    debouncedTerm: normalizedTerm,
    isSearchEnabled,
  }
}
