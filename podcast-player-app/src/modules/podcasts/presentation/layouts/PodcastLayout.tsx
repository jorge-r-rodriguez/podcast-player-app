import { type PropsWithChildren } from 'react'

type PodcastLayoutProps = PropsWithChildren<{
  title: string
}>

export function PodcastLayout({ children, title }: PodcastLayoutProps) {
  return (
    <main className="h-dvh overflow-hidden bg-[linear-gradient(144deg,rgba(27,27,27,1)_0%,rgba(20,21,31,1)_89%)] text-white">
      <h1 className="sr-only">{title}</h1>
      <section className="relative mx-auto h-dvh w-full max-w-[1512px] overflow-hidden px-5 pb-[130px] pt-[30px] sm:px-8">
        {children}
      </section>
    </main>
  )
}
