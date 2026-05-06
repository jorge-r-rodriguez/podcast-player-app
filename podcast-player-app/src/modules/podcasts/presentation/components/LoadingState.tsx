import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'

type LoadingStateProps = {
  label?: string
  variant?: 'page' | 'list'
}

export function LoadingState({ label = 'Loading', variant = 'page' }: LoadingStateProps) {
  if (variant === 'list') {
    return (
      <div aria-live="polite" className="grid gap-3" role="status">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="grid grid-cols-[52px_1fr] gap-4 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 sm:grid-cols-[52px_1fr_120px]"
            key={index}
          >
            <Skeleton height={52} sx={{ borderRadius: '8px' }} variant="rectangular" width={52} />
            <div>
              <Skeleton height={22} width="60%" />
              <Skeleton height={18} width="38%" />
            </div>
            <div className="hidden sm:block">
              <Skeleton height={18} width="75%" />
            </div>
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  return (
    <div
      aria-live="polite"
      className="grid min-h-dvh place-items-center bg-[#101116] px-6 text-center text-white"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <CircularProgress size={34} thickness={4} />
        <p className="text-sm font-medium text-white/60">{label}</p>
      </div>
    </div>
  )
}
