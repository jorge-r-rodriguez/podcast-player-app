import { Link } from 'react-router-dom'

import { PodcastLayout } from '@/modules/podcasts/presentation/layouts/PodcastLayout'

export function PodcastDetailPage() {
  return (
    <PodcastLayout
      description="Podcast metadata, episodes and audio playback will live in this route."
      eyebrow="Podcast Detail"
      title="Podcast details"
    >
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-white/60">
        Detail feature implementation will be added after the search module.
        <Link
          className="ml-2 font-semibold text-[#8f98ff] underline-offset-4 hover:underline"
          to="/podcasts"
        >
          Back to search
        </Link>
      </div>
    </PodcastLayout>
  )
}
