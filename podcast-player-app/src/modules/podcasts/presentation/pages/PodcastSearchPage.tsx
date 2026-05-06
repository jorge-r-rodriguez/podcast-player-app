import Pagination from '@mui/material/Pagination'
import { useMemo, useState } from 'react'

import { usePodcastSearch } from '@/modules/podcasts/application/hooks/usePodcastSearch'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import { PodcastList } from '@/modules/podcasts/presentation/components/PodcastList'
import { PodcastSearchInput } from '@/modules/podcasts/presentation/components/PodcastSearchInput'
import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

const PAGE_SIZE = 8
const DEFAULT_SEARCH_TERM = 'music'

export function PodcastSearchPage() {
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH_TERM)
  const [page, setPage] = useState(1)
  const {
    data: podcasts = [],
    debouncedTerm,
    error,
    isError,
    isFetching,
    isSearchEnabled,
    refetch,
  } = usePodcastSearch({
    term: searchTerm,
  })

  const totalPages = Math.max(1, Math.ceil(podcasts.length / PAGE_SIZE))

  const visiblePodcasts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE

    return podcasts.slice(start, start + PAGE_SIZE)
  }, [page, podcasts])

  const handleSearchChange = (nextSearchTerm: string) => {
    setSearchTerm(nextSearchTerm)
    setPage(1)
  }

  return (
    <PodcastLayout
      description="Search, browse and play music podcasts from the iTunes catalog."
      eyebrow="Podcast Search"
      title="Discover music podcasts"
    >
      <div className="grid gap-8">
        <section
          aria-label="Search controls"
          className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <PodcastSearchInput onChange={handleSearchChange} value={searchTerm} />
          <div className="rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-4 py-3 text-sm text-white/45">
            <span className="font-semibold text-white">{podcasts.length}</span> results
          </div>
        </section>

        {!isSearchEnabled ? (
          <EmptyState
            description="Type at least two characters to start searching the iTunes podcast catalog."
            title="Search for a podcast"
          />
        ) : null}

        {isError ? (
          <ErrorState
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => {
              void refetch()
            }}
          />
        ) : null}

        {isFetching ? <LoadingState label="Loading podcast results" variant="list" /> : null}

        {!isFetching && !isError && isSearchEnabled && podcasts.length === 0 ? (
          <EmptyState
            description={`No podcasts found for "${debouncedTerm}". Try another artist, genre or show name.`}
            title="No results found"
          />
        ) : null}

        {!isFetching && !isError && visiblePodcasts.length > 0 ? (
          <div className="grid gap-6">
            <PodcastList podcasts={visiblePodcasts} />
            {totalPages > 1 ? (
              <div className="flex justify-center">
                <Pagination
                  color="primary"
                  count={totalPages}
                  onChange={(_, nextPage) => setPage(nextPage)}
                  page={page}
                  shape="rounded"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </PodcastLayout>
  )
}
