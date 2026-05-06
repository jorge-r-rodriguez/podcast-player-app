import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'
import { PodcastCard } from './PodcastCard'

type PodcastListProps = {
  podcasts: PodcastSearchResult[]
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <section
      aria-label="Podcast search results"
      className="podcast-scroll max-h-[calc(100dvh-320px)] overflow-y-auto pr-1"
      data-testid="podcast-results-scroll"
    >
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </section>
  )
}
