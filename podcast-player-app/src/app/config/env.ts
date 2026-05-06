export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Podcast Player',
  apiBaseUrl: import.meta.env.VITE_ITUNES_API_BASE_URL ?? 'https://itunes.apple.com',
  corsProxyUrl: import.meta.env.VITE_CORS_PROXY_URL ?? 'https://api.allorigins.win/raw?url=',
  enableCorsProxy: import.meta.env.VITE_ENABLE_CORS_PROXY === 'true',
} as const
