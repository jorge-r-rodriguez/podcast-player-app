import { Play } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'

type PodcastCardProps = {
  podcast: PodcastSearchResult
}

export const PodcastCard = memo(function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <article className="h-[80px] border-b border-white/[0.03]">
      <Link
        aria-label={`Open details for ${podcast.title} by ${podcast.artist}`}
        className="grid h-full grid-cols-[30px_1fr] items-center gap-5 focus-visible:rounded sm:grid-cols-[30px_298px_210px_92px]"
        to={`/podcasts/${podcast.id}`}
      >
        <span className="grid size-[30px] place-items-center rounded-full">
          <Play aria-hidden="true" className="size-[15px] fill-white text-white" />
        </span>

        <div className="grid min-w-0 grid-cols-[45px_1fr] items-center gap-5">
          <div className="size-[45px] overflow-hidden rounded-lg bg-white/10">
            {podcast.artworkUrl ? (
              <img
                alt={`${podcast.title} artwork`}
                className="size-full object-cover"
                loading="lazy"
                src={podcast.artworkUrl}
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-medium text-white">{podcast.title}</h2>
            <p className="truncate text-sm font-medium text-white/30">{podcast.artist}</p>
          </div>
        </div>

        <p className="hidden max-h-10 max-w-[210px] overflow-hidden text-base font-medium leading-5 text-white/30 sm:block">
          {podcast.description ?? podcast.genre ?? 'Podcast from iTunes catalog'}
        </p>
        <p className="hidden text-base font-medium text-white/30 sm:block">
          {podcast.releaseDate ? 'recently' : 'unknown'}
        </p>
      </Link>
    </article>
  )
})
