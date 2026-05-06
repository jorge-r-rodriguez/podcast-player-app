import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Play } from 'lucide-react'

import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import { formatDate } from '@/shared/utils/formatDate'
import { formatDuration } from '@/shared/utils/formatDuration'

type EpisodeListProps = {
  episodes: Episode[]
  onSelectEpisode: (episode: Episode) => void
  selectedEpisodeId: string | null
}

export function EpisodeList({ episodes, onSelectEpisode, selectedEpisodeId }: EpisodeListProps) {
  return (
    <section aria-labelledby="episodes-heading" className="grid gap-3">
      <div className="grid grid-cols-[40px_1fr] gap-4 border-b border-white/[0.06] pb-3 text-sm font-semibold text-white/35 sm:grid-cols-[40px_1fr_130px_120px]">
        <span>#</span>
        <span id="episodes-heading">Episode</span>
        <span className="hidden sm:block">Released</span>
        <span className="hidden text-right sm:block">Duration</span>
      </div>

      {episodes.map((episode, index) => {
        const isSelected = episode.id === selectedEpisodeId

        return (
          <article
            className="grid grid-cols-[40px_1fr] gap-4 rounded-lg border border-white/[0.04] bg-white/[0.025] p-3 transition hover:bg-white/[0.05] sm:grid-cols-[40px_1fr_130px_120px] sm:items-center"
            key={episode.id}
          >
            <Tooltip title={episode.previewUrl ? 'Play episode preview' : 'Preview not available'}>
              <span>
                <IconButton
                  aria-label={`Play ${episode.title}`}
                  disabled={!episode.previewUrl}
                  onClick={() => onSelectEpisode(episode)}
                  size="small"
                >
                  <Play
                    aria-hidden="true"
                    className={`size-4 ${isSelected ? 'fill-[#5c67de] text-[#5c67de]' : 'text-white'}`}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                {episode.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/45">
                {episode.description ?? 'No episode description available.'}
              </p>
              <div className="mt-2 flex gap-3 text-xs text-white/35 sm:hidden">
                <span>{formatDate(episode.releaseDate)}</span>
                <span>{formatDuration(episode.durationMillis)}</span>
              </div>
            </div>
            <p className="hidden text-sm text-white/45 sm:block">
              {formatDate(episode.releaseDate)}
            </p>
            <p className="hidden text-right text-sm text-white/45 sm:block">
              {formatDuration(episode.durationMillis)}
            </p>
            <span className="sr-only">Episode {index + 1}</span>
          </article>
        )
      })}
    </section>
  )
}
