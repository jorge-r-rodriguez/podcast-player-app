import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'
import { PodcastCard } from './PodcastCard'

type PodcastListProps = {
  podcasts: PodcastSearchResult[]
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <section aria-label="Podcast search results" className="grid gap-3">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </section>
  )
}
