export type Episode = {
  id: string
  podcastId: string
  title: string
  description: string | null
  releaseDate: string | null
  durationMillis: number | null
  previewUrl: string | null
  artworkUrl: string | null
}
