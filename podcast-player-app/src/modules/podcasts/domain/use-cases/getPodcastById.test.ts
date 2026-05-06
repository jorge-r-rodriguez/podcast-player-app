import { getPodcastById } from './getPodcastById'

import type { PodcastRepository } from '@/modules/podcasts/domain/repositories/PodcastRepository'

describe('getPodcastById', () => {
  it('normalizes podcast id before calling the repository', async () => {
    const repository = createRepository()

    await getPodcastById(repository, ' 123 ')

    expect(repository.findById).toHaveBeenCalledWith('123')
  })

  it('returns null when id is empty', async () => {
    const repository = createRepository()

    await expect(getPodcastById(repository, '  ')).resolves.toBeNull()

    expect(repository.findById).not.toHaveBeenCalled()
  })
})

function createRepository(): jest.Mocked<PodcastRepository> {
  return {
    findById: jest.fn().mockResolvedValue(null),
    search: jest.fn(),
  }
}
