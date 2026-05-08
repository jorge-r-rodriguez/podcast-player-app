import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Clock3, Play } from 'lucide-react'

import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import { formatDate } from '@/shared/utils/formatDate'
import { formatDuration } from '@/shared/utils/formatDuration'

type EpisodeListProps = {
  episodes: Episode[]
  onSelectEpisode: (episode: Episode) => void
  playingEpisodeId?: string | null
  selectedEpisodeId: string | null
}

export function EpisodeList({
  episodes,
  onSelectEpisode,
  playingEpisodeId = null,
  selectedEpisodeId,
}: EpisodeListProps) {
  return (
    <section aria-labelledby="episodes-heading" className="mt-0 w-full max-w-[832px]">
      <div className="grid h-10 grid-cols-[30px_1fr] items-start gap-5 border-b border-white/[0.03] text-sm font-semibold text-white/30 sm:grid-cols-[30px_294px_210px_92px_37px]">
        <span>#</span>
        <span id="episodes-heading">Title</span>
        <span className="hidden sm:block">Topic</span>
        <span className="hidden sm:block">Released</span>
        <Clock3 className="hidden size-3.5 sm:block" />
      </div>

      <div
        className="podcast-scroll max-h-[calc(100dvh-500px)] min-h-[120px] overflow-y-auto pr-1 sm:max-h-[calc(100dvh-565px)] sm:min-h-[160px]"
        data-testid="episode-results-scroll"
      >
        {episodes.map((episode) => {
          const isSelected = episode.id === selectedEpisodeId
          const isPlaying = episode.id === playingEpisodeId

          return (
            <article className="h-[80px] border-b border-white/[0.03]" key={episode.id}>
              <div className="grid h-full grid-cols-[30px_1fr] items-center gap-5 sm:grid-cols-[30px_294px_210px_92px_37px]">
                <Tooltip
                  disableInteractive
                  disableTouchListener
                  title={episode.previewUrl ? 'Play episode preview' : 'Preview not available'}
                >
                  <span>
                    <IconButton
                      aria-label={isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
                      disabled={!episode.previewUrl}
                      onClick={() => onSelectEpisode(episode)}
                      size="small"
                      sx={{
                        backgroundColor: isSelected ? '#5c67de' : 'transparent',
                        height: 30,
                        transition:
                          'background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                        width: 30,
                        '@media (hover: hover) and (pointer: fine)': {
                          '&:not(.Mui-disabled):hover': {
                            backgroundColor: isSelected
                              ? '#717cff'
                              : 'rgba(92, 103, 222, 0.22)',
                          },
                        },
                      }}
                    >
                      <Play
                        aria-hidden="true"
                        className={`size-[15px] fill-white text-white ${isPlaying ? 'opacity-0' : ''}`}
                      />
                      {isPlaying ? (
                        <span className="absolute h-3 w-2.5 border-x-[4px] border-white" />
                      ) : null}
                    </IconButton>
                  </span>
                </Tooltip>

                <div className="grid min-w-0 grid-cols-[45px_1fr] items-center gap-5">
                  <div className="size-[45px] overflow-hidden rounded-lg bg-white/10">
                    {episode.artworkUrl ? (
                      <img
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                        src={episode.artworkUrl}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-medium text-white">{episode.title}</h3>
                    <p className="truncate text-sm font-medium text-white/30">Ken Adams</p>
                  </div>
                </div>

                <p className="hidden max-h-10 max-w-[210px] overflow-hidden text-base font-medium leading-5 text-white/30 sm:block">
                  {episode.description ?? 'Discovering your true passion is an ...'}
                </p>
                <p className="hidden text-base font-medium text-white/30 sm:block">
                  {formatDate(episode.releaseDate)}
                </p>
                <p className="hidden text-base font-medium text-white/30 sm:block">
                  {formatDuration(episode.durationMillis)}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
