import { BadgeCheck, ChevronLeft, Play } from 'lucide-react'
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
  const [detailSearchTerm, setDetailSearchTerm] = useState('')
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false)
  const [pauseRequestToken, setPauseRequestToken] = useState(0)
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

  const visibleEpisodes = useMemo(() => {
    const normalizedSearchTerm = detailSearchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) {
      return orderedEpisodes
    }

    return orderedEpisodes.filter((episode) => {
      const searchableText = `${episode.title} ${episode.description ?? ''}`.toLowerCase()

      return searchableText.includes(normalizedSearchTerm)
    })
  }, [detailSearchTerm, orderedEpisodes])

  const playableEpisodes = useMemo(
    () => visibleEpisodes.filter((episode) => episode.previewUrl),
    [visibleEpisodes],
  )

  const firstPlayableEpisode = playableEpisodes[0] ?? null

  const playerEpisode = useMemo(() => {
    if (selectedEpisode) {
      return selectedEpisode
    }

    return firstPlayableEpisode
  }, [firstPlayableEpisode, selectedEpisode])

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

  const toggleEpisodePlayback = (episode: Episode) => {
    const isCurrentEpisode = episode.id === playerEpisode?.id

    if (isCurrentEpisode && isPlayerPlaying) {
      setPauseRequestToken((token) => token + 1)
      return
    }

    playEpisode(episode)
  }

  const playFirstVisibleEpisode = () => {
    if (firstPlayableEpisode) {
      playEpisode(firstPlayableEpisode)
    }
  }

  return (
    <PodcastLayout title="Podcast View">
      <div className="mx-auto grid w-full max-w-[842px] gap-3 sm:gap-5">
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
            <div className="mt-1 overflow-hidden rounded-[15px] bg-white/10 sm:mt-3">
              <div className="h-[210px] w-full sm:h-[280px]">
                {podcast.artworkUrl ? (
                  <img
                    alt={`${podcast.title} artwork`}
                    className="size-full object-cover"
                    src={podcast.artworkUrl}
                  />
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 sm:-mt-2 sm:grid-cols-[60px_1fr_127px] sm:gap-0">
              <button
                aria-label={
                  firstPlayableEpisode
                    ? `Play first episode: ${firstPlayableEpisode.title}`
                    : 'Play playlist'
                }
                className="grid size-[52px] place-items-center rounded-full bg-[#5c67de] disabled:cursor-not-allowed disabled:opacity-45 sm:size-[60px]"
                disabled={!firstPlayableEpisode}
                onClick={playFirstVisibleEpisode}
                type="button"
              >
                <Play aria-hidden="true" className="ml-1 size-6 fill-white text-white sm:size-7" />
              </button>

              <div className="flex min-w-0 items-center gap-2 sm:justify-center sm:px-4">
                <h2 className="truncate text-[24px] font-bold leading-8 tracking-normal text-white sm:text-center sm:text-[32px] sm:leading-[40px]">
                  {podcast.title}
                </h2>
                <BadgeCheck className="size-5 shrink-0 fill-[#1d9bf0] text-[#1d9bf0] sm:size-[25px]" />
              </div>

              <div className="col-span-2 flex justify-end sm:col-span-1 sm:block">
                <OrderByControl
                  onChange={setSortOption}
                  options={EPISODE_SORT_OPTIONS}
                  value={sortOption}
                />
              </div>
            </div>

            {visibleEpisodes.length > 0 ? (
              <EpisodeList
                episodes={visibleEpisodes}
                onSelectEpisode={toggleEpisodePlayback}
                playingEpisodeId={isPlayerPlaying ? playerEpisode?.id : null}
                selectedEpisodeId={playerEpisode?.id ?? null}
              />
            ) : (
              <EmptyState
                description={
                  orderedEpisodes.length > 0
                    ? 'No episodes match the current search.'
                    : 'iTunes returned podcast metadata, but no episode list for this collection.'
                }
                title={
                  orderedEpisodes.length > 0 ? 'No matching episodes' : 'No episodes available'
                }
              />
            )}

            <BottomPlayerBar
              artist={podcast.artist}
              audioUrl={playerEpisode?.previewUrl}
              autoPlayToken={playRequestToken}
              artworkUrl={podcast.artworkUrl}
              onNext={() => selectAdjacentEpisode('next')}
              onPlaybackStateChange={setIsPlayerPlaying}
              onPrevious={() => selectAdjacentEpisode('previous')}
              onShuffle={selectRandomEpisode}
              pauseRequestToken={pauseRequestToken}
              title={playerEpisode?.title ?? podcast.title}
            />
          </>
        ) : null}
      </div>
    </PodcastLayout>
  )
}
