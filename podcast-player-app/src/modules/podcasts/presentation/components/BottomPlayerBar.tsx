import { Pause, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'

type BottomPlayerBarProps = {
  artist?: string
  artworkUrl?: string | null
  title?: string
}

export function BottomPlayerBar({
  artist = 'Ken Adams',
  artworkUrl,
  title = 'How to make your partner talk more',
}: BottomPlayerBarProps) {
  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 h-[110px] bg-[#1a1a1a] text-white">
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
              aria-label="Pause playback"
              className="grid size-[50px] place-items-center rounded-full bg-[#5c67de]"
              type="button"
            >
              <Pause className="size-5 fill-white text-white" />
            </button>
            <SkipForward className="size-6 text-white" />
            <Repeat className="size-6 text-white" />
          </div>

          <div className="grid grid-cols-[37px_1fr_31px] items-center gap-[14px] text-sm font-medium">
            <span>03:41</span>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-[45%] rounded-full bg-white" />
            </div>
            <span className="text-white/30">12:11</span>
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
