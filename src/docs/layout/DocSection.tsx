import { useEffect, type ReactNode } from 'react'
import { useDocSections } from '../context/DocSectionsContext'

type DocSectionProps = {
  id: string
  title: string
  level?: 2 | 3
  children: ReactNode
}

export function DocSection({
  id,
  title,
  level = 2,
  children,
}: DocSectionProps) {
  const { registerSection, unregisterSection } = useDocSections()

  useEffect(() => {
    registerSection({ id, title, level })
    return () => unregisterSection(id)
  }, [id, title, level, registerSection, unregisterSection])

  const HeadingTag = level === 2 ? 'h2' : 'h3'

  return (
    <section id={id} className="scroll-mt-24 border-t border-zinc-800 pt-10 first:border-t-0 first:pt-0">
      <HeadingTag
        className={
          level === 2
            ? 'mb-4 text-xl font-semibold tracking-tight text-zinc-100'
            : 'mb-3 text-lg font-medium text-zinc-200'
        }
      >
        <a href={`#${id}`} className="hover:text-emerald-400">
          {title}
        </a>
      </HeadingTag>
      <div className="space-y-6 text-zinc-300">{children}</div>
    </section>
  )
}
