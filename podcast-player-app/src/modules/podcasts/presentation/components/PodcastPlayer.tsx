import { Headphones } from 'lucide-react'

import type { Episode } from '@/modules/podcasts/domain/entities/Episode'

type PodcastPlayerProps = {
  artworkUrl: string | null
  episode: Episode | null
  podcastTitle: string
}

export function PodcastPlayer({ artworkUrl, episode, podcastTitle }: PodcastPlayerProps) {
  return (
    <aside
      aria-label="Podcast player"
      className="sticky bottom-0 z-10 -mx-5 mt-8 border-t border-white/[0.08] bg-[#1a1a1a]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] md:items-center">
        <div className="grid grid-cols-[56px_1fr] gap-4">
          <div className="size-14 overflow-hidden rounded-lg bg-white/[0.06]">
            {artworkUrl ? (
              <img
                alt={`${podcastTitle} artwork`}
                className="size-full object-cover"
                src={artworkUrl}
              />
            ) : (
              <div className="grid size-full place-items-center">
                <Headphones aria-hidden="true" className="size-6 text-white/35" />
              </div>
            )}
          </div>
          <div className="min-w-0 self-center">
            <p className="truncate text-sm font-semibold text-white">
              {episode?.title ?? podcastTitle}
            </p>
            <p className="mt-1 truncate text-sm text-white/40">
              {episode?.previewUrl
                ? 'Episode preview available'
                : 'Select an episode with preview audio'}
            </p>
          </div>
        </div>

        {episode?.previewUrl ? (
          // iTunes preview audio does not include a captions track URL.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio
            aria-label={`Audio preview for ${episode.title}`}
            className="w-full"
            controls
            key={episode.id}
            preload="none"
            src={episode.previewUrl}
          />
        ) : (
          <div className="rounded-lg border border-white/[0.08] px-4 py-3 text-sm text-white/45">
            No playable preview selected.
          </div>
        )}
      </div>
    </aside>
  )
}
