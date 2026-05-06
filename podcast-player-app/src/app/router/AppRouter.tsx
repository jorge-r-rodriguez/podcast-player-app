import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingState } from '@/modules/podcasts/presentation/components/LoadingState'

const PodcastSearchPage = lazy(() =>
  import('@/modules/podcasts/presentation/pages/PodcastSearchPage').then((module) => ({
    default: module.PodcastSearchPage,
  })),
)

const PodcastDetailPage = lazy(() =>
  import('@/modules/podcasts/presentation/pages/PodcastDetailPage').then((module) => ({
    default: module.PodcastDetailPage,
  })),
)

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState label="Preparing podcast experience" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/podcasts" replace />} />
        <Route path="/podcasts" element={<PodcastSearchPage />} />
        <Route path="/podcasts/:podcastId" element={<PodcastDetailPage />} />
        <Route path="*" element={<Navigate to="/podcasts" replace />} />
      </Routes>
    </Suspense>
  )
}
