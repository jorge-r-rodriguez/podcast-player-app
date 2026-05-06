import { ChevronDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { usePodcastSearch } from '@/modules/podcasts/application/hooks/usePodcastSearch'
import { BottomPlayerBar } from '@/modules/podcasts/presentation/components/BottomPlayerBar'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import { PodcastList } from '@/modules/podcasts/presentation/components/PodcastList'
import { PodcastSearchInput } from '@/modules/podcasts/presentation/components/PodcastSearchInput'
import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

const VISIBLE_ROWS = 8
const DEFAULT_SEARCH_TERM = 'podcast'

export function PodcastSearchPage() {
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH_TERM)
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

  const visiblePodcasts = useMemo(() => podcasts.slice(0, VISIBLE_ROWS), [podcasts])
  const bottomPodcast = visiblePodcasts[0]

  return (
    <PodcastLayout title="Podcast Search">
      <div className="mx-auto grid w-full max-w-[842px] gap-[34px]">
        <PodcastSearchInput onChange={setSearchTerm} value={searchTerm} />

        <div className="ml-auto flex h-10 items-center gap-5 text-white">
          <Search aria-hidden="true" className="size-4" />
          <button className="flex h-10 items-center gap-1.5 text-base font-normal" type="button">
            Order by
            <ChevronDown aria-hidden="true" className="size-[18px]" />
          </button>
        </div>

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

          {!isFetching && !isError && isSearchEnabled && visiblePodcasts.length === 0 ? (
            <EmptyState description="No podcasts found in iTunes." title="No results found" />
          ) : null}

          {!isFetching && !isError && visiblePodcasts.length > 0 ? (
            <PodcastList podcasts={visiblePodcasts} />
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
