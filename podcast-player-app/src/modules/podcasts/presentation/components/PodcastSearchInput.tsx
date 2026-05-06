import { Search } from 'lucide-react'

type PodcastSearchInputProps = {
  onChange: (value: string) => void
  value: string
}

export function PodcastSearchInput({ onChange, value }: PodcastSearchInputProps) {
  return (
    <div className="relative h-[50px] overflow-hidden rounded-[15px] bg-[#1a1a1a]">
      <label className="sr-only" htmlFor="podcast-search">
        Search podcasts
      </label>
      <Search aria-hidden="true" className="absolute left-5 top-[15px] size-5 text-white" />
      <input
        className="h-full w-full bg-transparent pl-14 pr-5 text-base font-normal text-white outline-none placeholder:text-white/40"
        id="podcast-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="podcast"
        type="search"
        value={value}
      />
    </div>
  )
}
