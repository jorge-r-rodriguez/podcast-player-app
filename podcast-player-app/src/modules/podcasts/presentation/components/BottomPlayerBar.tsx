import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

type BottomPlayerBarProps = {
  audioUrl?: string | null
  artist?: string
  autoPlayToken?: number
  artworkUrl?: string | null
  onNext?: () => void
  onPlaybackStateChange?: (isPlaying: boolean) => void
  onPrevious?: () => void
  onShuffle?: () => void
  title?: string
}

function formatPlaybackTime(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  const minutes = Math.floor(safeValue / 60)
  const seconds = Math.floor(safeValue % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const createRangeStyle = (progress: number) =>
  ({ '--range-progress': `${progress}%` }) as CSSProperties

export function BottomPlayerBar({
  audioUrl,
  artist = 'Ken Adams',
  autoPlayToken = 0,
  artworkUrl,
  onNext,
  onPlaybackStateChange,
  onPrevious,
  onShuffle,
  title = 'How to make your partner talk more',
}: BottomPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false)
  const [volume, setVolume] = useState(0.85)

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0
  const effectiveVolume = isMuted ? 0 : volume

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

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !audioUrl || autoPlayToken === 0) {
      return
    }

    const playSelectedEpisode = async () => {
      try {
        setIsPlaying(true)
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    }

    void playSelectedEpisode()
  }, [audioUrl, autoPlayToken])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume
    }
  }, [effectiveVolume])

  useEffect(() => {
    onPlaybackStateChange?.(isPlaying)
  }, [isPlaying, onPlaybackStateChange])

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

  const seekToProgress = (nextProgress: number) => {
    const audio = audioRef.current

    if (!audio || !duration) {
      return
    }

    audio.currentTime = (nextProgress / 100) * duration
    setCurrentTime(audio.currentTime)
  }

  const handleEnded = () => {
    const audio = audioRef.current

    if (isRepeatEnabled && audio) {
      audio.currentTime = 0
      void audio.play()
      return
    }

    setIsPlaying(false)
    onNext?.()
  }

  const updateVolume = (nextVolume: number) => {
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 h-[168px] bg-[#1a1a1a] text-white sm:h-[110px]">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- podcast previews are audio-only clips provided by iTunes without caption tracks. */}
      <audio
        aria-label={`Audio preview for ${title}`}
        onEnded={handleEnded}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
        src={audioUrl ?? undefined}
      />
      <div className="mx-auto grid h-full max-w-[1512px] grid-cols-[minmax(220px,407px)_1fr_160px] items-center gap-6 pr-[30px] max-lg:grid-cols-[minmax(180px,1fr)_1fr] max-sm:grid-cols-[1fr] max-sm:grid-rows-[54px_82px] max-sm:gap-4 max-sm:px-4 max-sm:py-3">
        <div className="grid min-w-0 grid-cols-[74px_1fr] items-center gap-5 max-sm:grid-cols-[54px_1fr] max-sm:gap-3 sm:grid-cols-[110px_1fr]">
          <div className="size-[74px] overflow-hidden bg-white/10 max-sm:size-[54px] sm:size-[110px]">
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

        <div className="grid min-w-0 grid-cols-[266px_minmax(220px,515px)] items-center gap-[50px] max-md:grid-cols-[1fr] max-md:justify-items-center max-md:gap-3">
          <div className="grid grid-cols-[24px_24px_50px_24px_24px] items-center gap-[30px] max-sm:gap-6">
            <button
              aria-label="Shuffle episode"
              className="grid size-6 place-items-center text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!audioUrl || !onShuffle}
              onClick={onShuffle}
              type="button"
            >
              <Shuffle className="size-6" />
            </button>
            <button
              aria-label="Previous episode"
              className="grid size-6 place-items-center text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!audioUrl || !onPrevious}
              onClick={onPrevious}
              type="button"
            >
              <SkipBack className="size-6" />
            </button>
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
            <button
              aria-label="Next episode"
              className="grid size-6 place-items-center text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!audioUrl || !onNext}
              onClick={onNext}
              type="button"
            >
              <SkipForward className="size-6" />
            </button>
            <button
              aria-label={isRepeatEnabled ? 'Disable repeat' : 'Enable repeat'}
              aria-pressed={isRepeatEnabled}
              className="grid size-6 place-items-center text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!audioUrl}
              onClick={() => setIsRepeatEnabled((nextValue) => !nextValue)}
              type="button"
            >
              <Repeat className={`size-6 ${isRepeatEnabled ? 'text-[#8f98ff]' : 'text-white'}`} />
            </button>
          </div>

          <div className="grid grid-cols-[37px_1fr_31px] items-center gap-[14px] text-sm font-medium max-md:w-full max-md:max-w-[420px]">
            <span>{formatPlaybackTime(currentTime)}</span>
            <input
              aria-label="Seek playback"
              className="player-range"
              disabled={!audioUrl || duration === 0}
              max={100}
              min={0}
              onChange={(event) => seekToProgress(Number(event.target.value))}
              onInput={(event) => seekToProgress(Number(event.currentTarget.value))}
              style={createRangeStyle(audioUrl ? progress : 45)}
              type="range"
              value={audioUrl ? progress : 45}
            />
            <span className="text-white/30">
              {audioUrl ? formatPlaybackTime(duration) : '12:11'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[24px_100px] items-center gap-[11px] max-lg:hidden">
          <button
            aria-label={isMuted ? 'Unmute playback' : 'Mute playback'}
            className="grid size-6 place-items-center text-white"
            onClick={() => setIsMuted((nextValue) => !nextValue)}
            type="button"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="size-6" />
            ) : (
              <Volume2 className="size-6" />
            )}
          </button>
          <input
            aria-label="Playback volume"
            className="player-range"
            max={1}
            min={0}
            onChange={(event) => updateVolume(Number(event.target.value))}
            onInput={(event) => updateVolume(Number(event.currentTarget.value))}
            step={0.01}
            style={createRangeStyle(effectiveVolume * 100)}
            type="range"
            value={effectiveVolume}
          />
        </div>
      </div>
    </aside>
  )
}
