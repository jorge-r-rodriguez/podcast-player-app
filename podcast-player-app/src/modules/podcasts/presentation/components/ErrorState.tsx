import Button from '@mui/material/Button'
import { AlertTriangle } from 'lucide-react'

type ErrorStateProps = {
  description?: string
  onRetry?: () => void
  title?: string
}

export function ErrorState({
  description = 'Something went wrong while loading podcasts. Please try again.',
  onRetry,
  title = 'Unable to load podcasts',
}: ErrorStateProps) {
  return (
    <section
      aria-live="assertive"
      className="rounded-lg border border-red-400/20 bg-red-500/[0.08] p-6 text-white"
      role="alert"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <AlertTriangle aria-hidden="true" className="mt-1 size-6 shrink-0 text-red-300" />
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{description}</p>
          </div>
        </div>
        {onRetry ? (
          <Button
            color="error"
            onClick={onRetry}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            variant="outlined"
          >
            Retry
          </Button>
        ) : null}
      </div>
    </section>
  )
}
