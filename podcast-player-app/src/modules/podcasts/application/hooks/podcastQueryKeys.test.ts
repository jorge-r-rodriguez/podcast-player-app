import { podcastQueryKeys } from './podcastQueryKeys'

describe('podcastQueryKeys', () => {
  it('builds stable search keys', () => {
    expect(podcastQueryKeys.search('jazz', 25)).toEqual(['podcasts', 'search', 'jazz', 25])
  })

  it('builds stable detail keys', () => {
    expect(podcastQueryKeys.detail('123')).toEqual(['podcasts', 'detail', '123'])
  })
})
