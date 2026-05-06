const MS_PER_MINUTE = 60000
const MINUTES_PER_HOUR = 60

export function formatDuration(durationMillis: number | null) {
  if (!durationMillis || durationMillis <= 0) {
    return 'Unknown duration'
  }

  const totalMinutes = Math.round(durationMillis / MS_PER_MINUTE)
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR)
  const minutes = totalMinutes % MINUTES_PER_HOUR

  if (hours === 0) {
    return `${minutes} min`
  }

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}
