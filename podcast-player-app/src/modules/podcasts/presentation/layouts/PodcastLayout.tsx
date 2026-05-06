import { type PropsWithChildren } from 'react'

type PodcastLayoutProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
}>

export function PodcastLayout({ children, description, eyebrow, title }: PodcastLayoutProps) {
  return (
    <main className="min-h-dvh bg-[linear-gradient(144deg,rgba(27,27,27,1)_0%,rgba(20,21,31,1)_89%)] text-white">
      <section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/35">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">{description}</p>
        </header>
        {children}
      </section>
    </main>
  )
}
