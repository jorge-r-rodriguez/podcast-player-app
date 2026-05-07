type VerifiedBadgeIconProps = {
  className?: string
}

export function VerifiedBadgeIcon({ className }: VerifiedBadgeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 2.25 15.04 4.3l3.24-.36 1.13 3.06 2.86 1.57-.96 3.12.96 3.12-2.86 1.57-1.13 3.06-3.24-.36-2.54 2.05-2.54-2.05-3.24.36-1.13-3.06-2.86-1.57.96-3.12-.96-3.12 2.86-1.57 1.13-3.06 3.24.36L12.5 2.25Z"
        fill="#1D9BF0"
      />
      <path
        d="m9.1 12.55 2.05 2.05 4.75-5"
        stroke="#111217"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  )
}
