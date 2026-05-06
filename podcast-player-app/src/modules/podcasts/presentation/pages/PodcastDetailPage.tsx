import { ChevronDown, ChevronLeft, Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { usePodcastDetail } from '@/modules/podcasts/application/hooks/usePodcastDetail'
import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import { BottomPlayerBar } from '@/modules/podcasts/presentation/components/BottomPlayerBar'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { EpisodeList } from '@/modules/podcasts/presentation/components/EpisodeList'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import { PodcastSearchInput } from '@/modules/podcasts/presentation/components/PodcastSearchInput'
import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

export function PodcastDetailPage() {
  const { podcastId } = useParams()
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const { data: podcast, error, isError, isFetching, refetch } = usePodcastDetail({ podcastId })

  const playerEpisode = useMemo(() => {
    if (selectedEpisode) {
      return selectedEpisode
    }

    return podcast?.episodes.find((episode) => episode.previewUrl) ?? null
  }, [podcast?.episodes, selectedEpisode])

  return (
    <PodcastLayout title="Podcast View">
      <div className="mx-auto grid w-full max-w-[842px] gap-5">
        <div className="grid grid-cols-[50px_1fr] gap-[15px]">
          <Link
            aria-label="Back to search"
            className="grid size-[50px] place-items-center rounded-[15px] bg-[#1a1a1a]"
            to="/podcasts"
          >
            <ChevronLeft className="size-5 text-white" />
          </Link>
          <PodcastSearchInput onChange={() => undefined} value="podcast" />
        </div>

        {isFetching ? <LoadingState label="Loading podcast detail" variant="list" /> : null}

        {isError ? (
          <ErrorState
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => {
              void refetch()
            }}
          />
        ) : null}

        {!isFetching && !isError && !podcast ? (
          <EmptyState
            description="The selected podcast could not be found in the iTunes catalog."
            title="Podcast not found"
          />
        ) : null}

        {podcast ? (
          <>
            <div className="mt-3 overflow-hidden rounded-[15px] bg-white/10">
              <div className="h-[280px] w-full">
                {podcast.artworkUrl ? (
                  <img
                    alt={`${podcast.title} artwork`}
                    className="size-full object-cover"
                    src={podcast.artworkUrl}
                  />
                ) : null}
              </div>
            </div>

            <div className="-mt-2 grid grid-cols-[60px_1fr_127px] items-center">
              <button
                aria-label="Pause playlist"
                className="grid size-[60px] place-items-center rounded-full bg-[#5c67de]"
                type="button"
              >
                <span className="h-6 w-4 border-x-[6px] border-white" />
              </button>

              <div className="flex min-w-0 items-center justify-center gap-2 px-4">
                <h2 className="truncate text-center text-[32px] font-bold leading-[40px] tracking-normal text-white">
                  {podcast.title}
                </h2>
                <ShieldCheck className="size-[25px] shrink-0 fill-[#1d9bf0] text-[#1d9bf0]" />
              </div>

              <div className="flex h-10 items-center gap-5 text-white">
                <Search aria-hidden="true" className="size-4" />
                <button
                  className="flex h-10 items-center gap-1.5 text-base font-normal"
                  type="button"
                >
                  Order by
                  <ChevronDown aria-hidden="true" className="size-[18px]" />
                </button>
              </div>
            </div>

            {podcast.episodes.length > 0 ? (
              <EpisodeList
                episodes={podcast.episodes.slice(0, 6)}
                onSelectEpisode={setSelectedEpisode}
                selectedEpisodeId={playerEpisode?.id ?? null}
              />
            ) : (
              <EmptyState
                description="iTunes returned podcast metadata, but no episode list for this collection."
                title="No episodes available"
              />
            )}

            <BottomPlayerBar
              artist={podcast.artist}
              artworkUrl={podcast.artworkUrl}
              title={playerEpisode?.title ?? podcast.title}
            />
          </>
        ) : null}
      </div>
    </PodcastLayout>
  )
}
