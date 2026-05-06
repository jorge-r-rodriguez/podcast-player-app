import axios, { type AxiosInstance } from 'axios'

import { env } from '@/app/config/env'

export type ITunesPodcastDto = {
  wrapperType?: string
  kind?: string
  collectionId?: number
  trackId?: number
  collectionName?: string
  trackName?: string
  artistName?: string
  collectionViewUrl?: string
  feedUrl?: string
  artworkUrl100?: string
  artworkUrl600?: string
  primaryGenreName?: string
  genres?: string[]
  releaseDate?: string
  trackCount?: number
  description?: string
  shortDescription?: string
  longDescription?: string
  previewUrl?: string
  trackTimeMillis?: number
}

export type ITunesSearchResponse = {
  resultCount: number
  results: ITunesPodcastDto[]
}

export type ITunesLookupResponse = ITunesSearchResponse

type RequestParams = Record<string, string | number | undefined>

export class ITunesApiClient {
  private readonly httpClient: AxiosInstance

  constructor(httpClient: AxiosInstance = axios.create({ timeout: 10000 })) {
    this.httpClient = httpClient
  }

  async searchPodcasts(term: string, limit: number): Promise<ITunesPodcastDto[]> {
    const response = await this.httpClient.get<ITunesSearchResponse>(this.createUrl('/search'), {
      params: {
        entity: 'podcast',
        limit,
        media: 'podcast',
        term,
      } satisfies RequestParams,
    })

    return response.data.results
  }

  async lookupPodcast(podcastId: string): Promise<ITunesPodcastDto[]> {
    const response = await this.httpClient.get<ITunesLookupResponse>(this.createUrl('/lookup'), {
      params: {
        entity: 'podcastEpisode',
        id: podcastId,
      } satisfies RequestParams,
    })

    return response.data.results
  }

  private createUrl(path: string) {
    const targetUrl = `${env.apiBaseUrl}${path}`

    if (!env.enableCorsProxy) {
      return targetUrl
    }

    return `${env.corsProxyUrl}${encodeURIComponent(targetUrl)}`
  }
}
