import { ChevronLeft, Play, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { usePodcastDetail } from '@/modules/podcasts/application/hooks/usePodcastDetail'
import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import { BottomPlayerBar } from '@/modules/podcasts/presentation/components/BottomPlayerBar'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { EpisodeList } from '@/modules/podcasts/presentation/components/EpisodeList'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import {
  type OrderByOption,
  OrderByControl,
} from '@/modules/podcasts/presentation/components/OrderByControl'
import { PodcastSearchInput } from '@/modules/podcasts/presentation/components/PodcastSearchInput'
import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

type EpisodeSortOption = 'released' | 'title' | 'duration'

const EPISODE_SORT_OPTIONS: OrderByOption<EpisodeSortOption>[] = [
  { label: 'Released', value: 'released' },
  { label: 'Title', value: 'title' },
  { label: 'Duration', value: 'duration' },
]

export function PodcastDetailPage() {
  const { podcastId } = useParams()
  const [detailSearchTerm, setDetailSearchTerm] = useState('podcast')
  const [playRequestToken, setPlayRequestToken] = useState(0)
  const [sortOption, setSortOption] = useState<EpisodeSortOption>('released')
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const { data: podcast, error, isError, isFetching, refetch } = usePodcastDetail({ podcastId })

  const orderedEpisodes = useMemo(() => {
    const nextEpisodes = [...(podcast?.episodes ?? [])]

    if (sortOption === 'title') {
      return nextEpisodes.sort((left, right) => left.title.localeCompare(right.title))
    }

    if (sortOption === 'duration') {
      return nextEpisodes.sort(
        (left, right) => (right.durationMillis ?? 0) - (left.durationMillis ?? 0),
      )
    }

    return nextEpisodes.sort(
      (left, right) =>
        new Date(right.releaseDate ?? 0).getTime() - new Date(left.releaseDate ?? 0).getTime(),
    )
  }, [podcast?.episodes, sortOption])

  const playableEpisodes = useMemo(
    () => orderedEpisodes.filter((episode) => episode.previewUrl),
    [orderedEpisodes],
  )

  const playerEpisode = useMemo(() => {
    if (selectedEpisode) {
      return selectedEpisode
    }

    return playableEpisodes[0] ?? null
  }, [playableEpisodes, selectedEpisode])

  const selectAdjacentEpisode = (direction: 'next' | 'previous') => {
    if (playableEpisodes.length === 0) {
      return
    }

    const currentIndex = Math.max(
      playableEpisodes.findIndex((episode) => episode.id === playerEpisode?.id),
      0,
    )
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % playableEpisodes.length
        : (currentIndex - 1 + playableEpisodes.length) % playableEpisodes.length

    setSelectedEpisode(playableEpisodes[nextIndex])
    setPlayRequestToken((token) => token + 1)
  }

  const selectRandomEpisode = () => {
    if (playableEpisodes.length === 0) {
      return
    }

    const currentIndex = playableEpisodes.findIndex((episode) => episode.id === playerEpisode?.id)
    const availableIndexes = playableEpisodes
      .map((_, index) => index)
      .filter((index) => index !== currentIndex)
    const indexes = availableIndexes.length > 0 ? availableIndexes : [0]
    const nextIndex = indexes[Math.floor(Math.random() * indexes.length)]

    setSelectedEpisode(playableEpisodes[nextIndex])
    setPlayRequestToken((token) => token + 1)
  }

  const playEpisode = (episode: Episode) => {
    setSelectedEpisode(episode)
    setPlayRequestToken((token) => token + 1)
  }

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
          <PodcastSearchInput onChange={setDetailSearchTerm} value={detailSearchTerm} />
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
                aria-label={playerEpisode ? `Play ${playerEpisode.title}` : 'Play playlist'}
                className="grid size-[60px] place-items-center rounded-full bg-[#5c67de]"
                onClick={() => {
                  if (playerEpisode) {
                    playEpisode(playerEpisode)
                  }
                }}
                type="button"
              >
                <Play aria-hidden="true" className="ml-1 size-7 fill-white text-white" />
              </button>

              <div className="flex min-w-0 items-center justify-center gap-2 px-4">
                <h2 className="truncate text-center text-[32px] font-bold leading-[40px] tracking-normal text-white">
                  {podcast.title}
                </h2>
                <ShieldCheck className="size-[25px] shrink-0 fill-[#1d9bf0] text-[#1d9bf0]" />
              </div>

              <OrderByControl
                onChange={setSortOption}
                options={EPISODE_SORT_OPTIONS}
                value={sortOption}
              />
            </div>

            {orderedEpisodes.length > 0 ? (
              <EpisodeList
                episodes={orderedEpisodes}
                onSelectEpisode={playEpisode}
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
              audioUrl={playerEpisode?.previewUrl}
              autoPlayToken={playRequestToken}
              artworkUrl={podcast.artworkUrl}
              onNext={() => selectAdjacentEpisode('next')}
              onPrevious={() => selectAdjacentEpisode('previous')}
              onShuffle={selectRandomEpisode}
              title={playerEpisode?.title ?? podcast.title}
            />
          </>
        ) : null}
      </div>
    </PodcastLayout>
  )
}
