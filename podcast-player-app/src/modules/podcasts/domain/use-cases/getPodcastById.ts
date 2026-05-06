import type { PodcastRepository } from '@/modules/podcasts/domain/repositories/PodcastRepository'

export async function getPodcastById(repository: PodcastRepository, podcastId: string) {
  const normalizedPodcastId = podcastId.trim()

  if (!normalizedPodcastId) {
    return null
  }

  return repository.findById(normalizedPodcastId)
}
