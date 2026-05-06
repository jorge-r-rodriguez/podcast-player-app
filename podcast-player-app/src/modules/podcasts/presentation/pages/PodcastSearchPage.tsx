import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

export function PodcastSearchPage() {
  return (
    <PodcastLayout
      description="Search, browse and play music podcasts from the iTunes catalog."
      eyebrow="Podcast Search"
      title="Discover music podcasts"
    >
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-white/60">
        Search feature implementation will be added in the next commit.
      </div>
    </PodcastLayout>
  )
}
