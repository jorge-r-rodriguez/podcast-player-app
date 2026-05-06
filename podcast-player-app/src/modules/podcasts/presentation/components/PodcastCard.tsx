import Tooltip from '@mui/material/Tooltip'
import { Headphones, Play } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import type { PodcastSearchResult } from '@/modules/podcasts/domain/entities/Podcast'

type PodcastCardProps = {
  podcast: PodcastSearchResult
}

export const PodcastCard = memo(function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <article className="group rounded-lg border border-white/[0.06] bg-white/[0.03] transition hover:border-white/15 hover:bg-white/[0.06]">
      <Link
        aria-label={`Open details for ${podcast.title} by ${podcast.artist}`}
        className="grid min-h-[88px] grid-cols-[52px_1fr] gap-4 p-3 focus-visible:rounded-lg sm:grid-cols-[52px_1fr_120px]"
        to={`/podcasts/${podcast.id}`}
      >
        <div className="relative size-[52px] overflow-hidden rounded-lg bg-white/[0.06]">
          {podcast.artworkUrl ? (
            <img
              alt={`${podcast.title} artwork`}
              className="size-full object-cover"
              loading="lazy"
              src={podcast.artworkUrl}
            />
          ) : (
            <div className="grid size-full place-items-center">
              <Headphones aria-hidden="true" className="size-6 text-white/35" />
            </div>
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition group-hover:opacity-100">
            <Play aria-hidden="true" className="size-5 fill-white text-white" />
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-white">{podcast.title}</h2>
          <p className="mt-1 truncate text-sm text-white/45">{podcast.artist}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-white/35 sm:hidden">
            {podcast.genre ? <span>{podcast.genre}</span> : null}
            {podcast.episodeCount ? <span>{podcast.episodeCount} episodes</span> : null}
          </div>
        </div>
        <div className="hidden min-w-0 flex-col items-end justify-center text-right sm:flex">
          {podcast.genre ? (
            <Tooltip title="Primary genre">
              <p className="max-w-[120px] truncate text-sm text-white/45">{podcast.genre}</p>
            </Tooltip>
          ) : null}
          {podcast.episodeCount ? (
            <p className="mt-1 text-xs font-medium text-white/30">
              {podcast.episodeCount} episodes
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
})
