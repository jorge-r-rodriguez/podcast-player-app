import { useMemo, useState } from 'react'

import { usePodcastSearch } from '@/modules/podcasts/application/hooks/usePodcastSearch'
import { BottomPlayerBar } from '@/modules/podcasts/presentation/components/BottomPlayerBar'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import {
  type OrderByOption,
  OrderByControl,
} from '@/modules/podcasts/presentation/components/OrderByControl'
import { PodcastList } from '@/modules/podcasts/presentation/components/PodcastList'
import { PodcastSearchInput } from '@/modules/podcasts/presentation/components/PodcastSearchInput'
import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

const DEFAULT_SEARCH_TERM = 'podcast'
type PodcastSortOption = 'relevance' | 'title' | 'artist' | 'released' | 'episodes'

const PODCAST_SORT_OPTIONS: OrderByOption<PodcastSortOption>[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Name', value: 'title' },
  { label: 'Artist', value: 'artist' },
  { label: 'Released', value: 'released' },
  { label: 'Episodes', value: 'episodes' },
]

const compareNullableDatesDesc = (left: string | null, right: string | null) =>
  new Date(right ?? 0).getTime() - new Date(left ?? 0).getTime()

export function PodcastSearchPage() {
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH_TERM)
  const [sortOption, setSortOption] = useState<PodcastSortOption>('relevance')
  const {
    data: podcasts = [],
    error,
    isError,
    isFetching,
    isSearchEnabled,
    refetch,
  } = usePodcastSearch({
    term: searchTerm,
  })

  const orderedPodcasts = useMemo(() => {
    const nextPodcasts = [...podcasts]

    if (sortOption === 'title') {
      return nextPodcasts.sort((left, right) => left.title.localeCompare(right.title))
    }

    if (sortOption === 'artist') {
      return nextPodcasts.sort((left, right) => left.artist.localeCompare(right.artist))
    }

    if (sortOption === 'released') {
      return nextPodcasts.sort((left, right) =>
        compareNullableDatesDesc(left.releaseDate, right.releaseDate),
      )
    }

    if (sortOption === 'episodes') {
      return nextPodcasts.sort(
        (left, right) => (right.episodeCount ?? 0) - (left.episodeCount ?? 0),
      )
    }

    return nextPodcasts
  }, [podcasts, sortOption])

  const bottomPodcast = orderedPodcasts[0]

  return (
    <PodcastLayout title="Podcast Search">
      <div className="mx-auto grid w-full max-w-[842px] gap-[34px]">
        <PodcastSearchInput onChange={setSearchTerm} value={searchTerm} />

        <OrderByControl
          onChange={setSortOption}
          options={PODCAST_SORT_OPTIONS}
          value={sortOption}
        />

        <div className="mx-auto w-full max-w-[832px]">
          <div className="grid h-10 grid-cols-[30px_1fr] items-start gap-5 border-b border-white/[0.03] text-sm font-semibold text-white/30 sm:grid-cols-[30px_298px_210px_92px]">
            <span>#</span>
            <span>Name</span>
            <span className="hidden sm:block">Description</span>
            <span className="hidden sm:block">Released</span>
          </div>

          {isFetching ? <LoadingState label="Loading podcast results" variant="list" /> : null}

          {isError ? (
            <ErrorState
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => {
                void refetch()
              }}
            />
          ) : null}

          {!isFetching && !isError && !isSearchEnabled ? (
            <EmptyState
              description="Type at least two characters to start searching the iTunes podcast catalog."
              title="Search for a podcast"
            />
          ) : null}

          {!isFetching && !isError && isSearchEnabled && orderedPodcasts.length === 0 ? (
            <EmptyState description="No podcasts found in iTunes." title="No results found" />
          ) : null}

          {!isFetching && !isError && orderedPodcasts.length > 0 ? (
            <PodcastList podcasts={orderedPodcasts} />
          ) : null}
        </div>
      </div>

      <BottomPlayerBar
        artist={bottomPodcast?.artist}
        artworkUrl={bottomPodcast?.artworkUrl}
        title={bottomPodcast?.title}
      />
    </PodcastLayout>
  )
}
