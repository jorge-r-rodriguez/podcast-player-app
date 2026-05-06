import { SearchX } from 'lucide-react'

type EmptyStateProps = {
  description: string
  title: string
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <section
      className="grid min-h-72 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.025] px-6 py-12 text-center"
      role="status"
    >
      <div className="max-w-sm">
        <SearchX aria-hidden="true" className="mx-auto size-10 text-white/30" />
        <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
      </div>
    </section>
  )
}
