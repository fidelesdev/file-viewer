import { useEffect, type ReactNode } from 'react'

type DocPageProps = {
  title: string
  description: string
  children: ReactNode
}

export function DocPage({ title, description, children }: DocPageProps) {
  useEffect(() => {
    document.title = `${title} — @fdls/file-viewer`
  }, [title])

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          {description}
        </p>
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  )
}
