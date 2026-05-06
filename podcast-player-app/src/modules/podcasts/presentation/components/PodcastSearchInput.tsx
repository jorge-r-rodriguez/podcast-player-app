import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { Search } from 'lucide-react'

type PodcastSearchInputProps = {
  onChange: (value: string) => void
  value: string
}

export function PodcastSearchInput({ onChange, value }: PodcastSearchInputProps) {
  return (
    <TextField
      fullWidth
      id="podcast-search"
      label="Search podcasts"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search music, jazz, interviews..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search aria-hidden="true" className="size-5 text-white/55" />
            </InputAdornment>
          ),
        },
      }}
      value={value}
      variant="outlined"
    />
  )
}
