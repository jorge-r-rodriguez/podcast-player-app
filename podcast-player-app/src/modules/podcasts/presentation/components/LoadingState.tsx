import CircularProgress from '@mui/material/CircularProgress'

type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
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
