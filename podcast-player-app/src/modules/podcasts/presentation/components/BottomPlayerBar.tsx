import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type BottomPlayerBarProps = {
  audioUrl?: string | null
  artist?: string
  artworkUrl?: string | null
  title?: string
}

function formatPlaybackTime(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  const minutes = Math.floor(safeValue / 60)
  const seconds = Math.floor(safeValue % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function BottomPlayerBar({
  audioUrl,
  artist = 'Ken Adams',
  artworkUrl,
  title = 'How to make your partner talk more',
}: BottomPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
  }, [audioUrl])

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio || !audioUrl) {
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 h-[110px] bg-[#1a1a1a] text-white">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- podcast previews are audio-only clips provided by iTunes without caption tracks. */}
      <audio
        aria-label={`Audio preview for ${title}`}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
        src={audioUrl ?? undefined}
      />
      <div className="mx-auto grid h-full max-w-[1512px] grid-cols-[minmax(220px,407px)_1fr_160px] items-center gap-6 pr-[30px] max-lg:grid-cols-[minmax(180px,1fr)_1fr] max-sm:grid-cols-[1fr] max-sm:px-4">
        <div className="grid min-w-0 grid-cols-[74px_1fr] items-center gap-5 sm:grid-cols-[110px_1fr]">
          <div className="size-[74px] overflow-hidden bg-white/10 sm:size-[110px]">
            {artworkUrl ? (
              <img alt="" className="size-full object-cover" src={artworkUrl} />
            ) : (
              <div className="size-full bg-[linear-gradient(135deg,#5d5f65,#171719)]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white sm:text-base">{title}</p>
            <p className="truncate text-sm font-medium text-white/30">{artist}</p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-[266px_minmax(220px,515px)] items-center gap-[50px] max-md:hidden">
          <div className="grid grid-cols-[24px_24px_50px_24px_24px] items-center gap-[30px]">
            <Shuffle className="size-6 text-white" />
            <SkipBack className="size-6 text-white" />
            <button
              aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
              className="grid size-[50px] place-items-center rounded-full bg-[#5c67de] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!audioUrl}
              onClick={() => {
                void togglePlayback()
              }}
              type="button"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-white text-white" />
              ) : (
                <Play className="ml-1 size-5 fill-white text-white" />
              )}
            </button>
            <SkipForward className="size-6 text-white" />
            <Repeat className="size-6 text-white" />
          </div>

          <div className="grid grid-cols-[37px_1fr_31px] items-center gap-[14px] text-sm font-medium">
            <span>{formatPlaybackTime(currentTime)}</span>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${audioUrl ? progress : 45}%` }}
              />
            </div>
            <span className="text-white/30">
              {audioUrl ? formatPlaybackTime(duration) : '12:11'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[24px_100px] items-center gap-[11px] max-lg:hidden">
          <Volume2 className="size-6 text-white" />
          <div className="h-[5px] overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-[85%] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </aside>
  )
}
