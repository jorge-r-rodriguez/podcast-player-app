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
    const response = await this.request('/search', {
      entity: 'podcast',
      limit,
      media: 'podcast',
      term,
    })

    return response.results
  }

  async lookupPodcast(podcastId: string): Promise<ITunesPodcastDto[]> {
    const response = await this.request('/lookup', {
      entity: 'podcastEpisode',
      id: podcastId,
    })

    return response.results
  }

  private async request(path: string, params: RequestParams) {
    const targetUrl = this.createTargetUrl(path, params)

    try {
      const response = await this.httpClient.get<ITunesLookupResponse>(targetUrl)

      return response.data
    } catch (error) {
      if (this.canUseJsonpFallback()) {
        return this.requestWithJsonp(targetUrl)
      }

      if (env.enableCorsProxy) {
        const response = await this.httpClient.get<ITunesLookupResponse>(
          `${env.corsProxyUrl}${encodeURIComponent(targetUrl)}`,
        )

        return response.data
      }

      throw error
    }
  }

  private createTargetUrl(path: string, params: RequestParams) {
    const url = new URL(`${env.apiBaseUrl}${path}`)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })

    return url.toString()
  }

  private canUseJsonpFallback() {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  }

  private requestWithJsonp(targetUrl: string) {
    return new Promise<ITunesLookupResponse>((resolve, reject) => {
      const callbackName = `itunesJsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`
      const url = new URL(targetUrl)
      const script = document.createElement('script')
      const browserWindow = window as unknown as Window &
        Record<string, (payload: ITunesLookupResponse) => void>

      const cleanup = () => {
        script.remove()
        delete browserWindow[callbackName]
        window.clearTimeout(timeoutId)
      }

      const timeoutId = window.setTimeout(() => {
        cleanup()
        reject(new Error('iTunes JSONP request timed out'))
      }, 10000)

      browserWindow[callbackName] = (payload) => {
        cleanup()
        resolve(payload)
      }

      script.onerror = () => {
        cleanup()
        reject(new Error('iTunes JSONP request failed'))
      }

      url.searchParams.set('callback', callbackName)
      script.src = url.toString()
      script.async = true

      document.head.appendChild(script)
    })
  }
}
