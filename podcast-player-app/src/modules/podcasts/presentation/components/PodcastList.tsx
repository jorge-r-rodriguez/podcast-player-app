import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'
import { PodcastCard } from './PodcastCard'

type PodcastListProps = {
  podcasts: PodcastSearchResult[]
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <section
      aria-label="Podcast search results"
      className="podcast-scroll max-h-[calc(100dvh-320px)] scroll-pb-[176px] overflow-y-auto pb-[176px] pr-1 sm:scroll-pb-[156px] sm:pb-[156px] lg:scroll-pb-[130px] lg:pb-[130px]"
      data-testid="podcast-results-scroll"
    >
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </section>
  )
}
