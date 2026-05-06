import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { ArrowLeft, Headphones } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { usePodcastDetail } from '@/modules/podcasts/application/hooks/usePodcastDetail'
import type { Episode } from '@/modules/podcasts/domain/entities/Episode'
import { EmptyState } from '@/modules/podcasts/presentation/components/EmptyState'
import { EpisodeList } from '@/modules/podcasts/presentation/components/EpisodeList'
import { ErrorState } from '@/modules/podcasts/presentation/components/ErrorState'
import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'
import { PodcastPlayer } from '@/modules/podcasts/presentation/components/PodcastPlayer'
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
    <PodcastLayout
      description="Review podcast metadata, browse available episodes and listen to playable previews."
      eyebrow="Podcast Detail"
      title={podcast?.title ?? 'Podcast details'}
    >
      <div className="grid gap-8 pb-28">
        <Button
          component={Link}
          startIcon={<ArrowLeft className="size-4" />}
          sx={{ alignSelf: 'flex-start' }}
          to="/podcasts"
          variant="text"
        >
          Back to search
        </Button>

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
            <section className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-end">
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-white/[0.06] shadow-2xl shadow-black/30 lg:aspect-square">
                {podcast.artworkUrl ? (
                  <img
                    alt={`${podcast.title} artwork`}
                    className="size-full object-cover"
                    src={podcast.artworkUrl}
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Headphones aria-hidden="true" className="size-16 text-white/30" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {podcast.genre ? (
                    <Chip color="primary" label={podcast.genre} size="small" />
                  ) : null}
                  {podcast.episodeCount ? (
                    <Chip
                      label={`${podcast.episodeCount} episodes`}
                      size="small"
                      variant="outlined"
                    />
                  ) : null}
                </div>
                <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">
                  {podcast.title}
                </h2>
                <p className="mt-3 text-lg font-medium text-white/60">{podcast.artist}</p>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/50">
                  {podcast.description ?? 'No podcast description available from iTunes.'}
                </p>
              </div>
            </section>

            {podcast.episodes.length > 0 ? (
              <EpisodeList
                episodes={podcast.episodes}
                onSelectEpisode={setSelectedEpisode}
                selectedEpisodeId={playerEpisode?.id ?? null}
              />
            ) : (
              <EmptyState
                description="iTunes returned podcast metadata, but no episode list for this collection."
                title="No episodes available"
              />
            )}

            <PodcastPlayer
              artworkUrl={podcast.artworkUrl}
              episode={playerEpisode}
              podcastTitle={podcast.title}
            />
          </>
        ) : null}
      </div>
    </PodcastLayout>
  )
}
