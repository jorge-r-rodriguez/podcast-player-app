import { searchPodcasts } from './searchPodcasts'

import type { PodcastRepository } from '@/modules/podcasts/domain/repositories/PodcastRepository'

describe('searchPodcasts', () => {
  it('trims the term and uses the default limit', async () => {
    const repository = createRepository()

    await searchPodcasts(repository, { term: '  jazz  ' })

    expect(repository.search).toHaveBeenCalledWith({ limit: 50, term: 'jazz' })
  })

  it('does not call the repository for short terms', async () => {
    const repository = createRepository()

    await expect(searchPodcasts(repository, { term: 'a' })).resolves.toEqual([])

    expect(repository.search).not.toHaveBeenCalled()
  })
})

function createRepository(): jest.Mocked<PodcastRepository> {
  return {
    findById: jest.fn(),
    search: jest.fn().mockResolvedValue([]),
  }
}
