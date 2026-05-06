import { useQuery } from '@tanstack/react-query'

import { podcastRepository } from '@/modules/podcasts/application/services/podcastService'
import { getPodcastById } from '@/modules/podcasts/domain/use-cases/getPodcastById'
import { podcastQueryKeys } from './podcastQueryKeys'

type UsePodcastDetailParams = {
  podcastId: string | undefined
}

export function usePodcastDetail({ podcastId }: UsePodcastDetailParams) {
  const normalizedPodcastId = podcastId?.trim() ?? ''

  return useQuery({
    enabled: normalizedPodcastId.length > 0,
    queryFn: () => getPodcastById(podcastRepository, normalizedPodcastId),
    queryKey: podcastQueryKeys.detail(normalizedPodcastId),
    staleTime: 1000 * 60 * 15,
  })
}
