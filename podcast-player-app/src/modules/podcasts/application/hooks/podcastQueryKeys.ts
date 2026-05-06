export const podcastQueryKeys = {
  all: ['podcasts'] as const,
  detail: (podcastId: string) => [...podcastQueryKeys.details(), podcastId] as const,
  details: () => [...podcastQueryKeys.all, 'detail'] as const,
  search: (term: string, limit: number) => [...podcastQueryKeys.searches(), term, limit] as const,
  searches: () => [...podcastQueryKeys.all, 'search'] as const,
}
