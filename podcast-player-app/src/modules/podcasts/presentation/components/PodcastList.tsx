import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'
import { PodcastCard } from './PodcastCard'

type PodcastListProps = {
  podcasts: PodcastSearchResult[]
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <section
      aria-label="Podcast search results"
      className="podcast-scroll max-h-[calc(100dvh-380px)] scroll-pb-20 overflow-y-auto pb-20 pr-1 sm:max-h-[calc(100dvh-390px)] sm:scroll-pb-0 sm:pb-0 lg:max-h-[calc(100dvh-365px)]"
      data-testid="podcast-results-scroll"
    >
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </section>
  )
}
