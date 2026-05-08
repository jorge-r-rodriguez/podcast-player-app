import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

export type OrderByOption<T extends string> = {
  label: string
  value: T
}

type OrderByControlProps<T extends string> = {
  label?: string
  onChange: (value: T) => void
  options: OrderByOption<T>[]
  value: T
}

export function OrderByControl<T extends string>({
  label = 'Order by',
  onChange,
  options,
  value,
}: OrderByControlProps<T>) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const selectedOption = options.find((option) => option.value === value)

  const closeMenu = () => setAnchorElement(null)

  return (
    <div className="ml-auto flex h-10 items-center gap-5 text-white">
      <Search aria-hidden="true" className="size-4" />
      <button
        aria-controls={anchorElement ? 'podcast-order-menu' : undefined}
        aria-expanded={anchorElement ? 'true' : undefined}
        aria-haspopup="menu"
        className="control-button order-button flex h-10 items-center gap-1.5 text-base font-normal"
        onClick={(event) => setAnchorElement(event.currentTarget)}
        type="button"
      >
        {label}
        <ChevronDown aria-hidden="true" className="size-[18px]" />
      </button>

      <Menu
        anchorEl={anchorElement}
        id="podcast-order-menu"
        onClose={closeMenu}
        open={Boolean(anchorElement)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              minWidth: 180,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            aria-current={option.value === selectedOption?.value ? 'true' : undefined}
            key={option.value}
            onClick={() => {
              onChange(option.value)
              closeMenu()
            }}
            selected={option.value === selectedOption?.value}
            sx={{
              fontFamily: 'Quicksand, Inter, system-ui, sans-serif',
              fontSize: 14,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
