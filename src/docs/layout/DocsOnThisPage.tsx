import { useDocSections } from '../context/DocSectionsContext'
import { useActiveSection } from '../hooks/useActiveSection'

export function DocsOnThisPage() {
  const { sections } = useDocSections()
  const sectionIds = sections.map((section) => section.id)
  const activeId = useActiveSection(sectionIds)

  if (sections.length === 0) {
    return null
  }

  return (
    <aside
      className="hidden w-52 shrink-0 xl:block"
      aria-label="On this page"
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          On this page
        </p>
        <ul className="space-y-2 border-l border-zinc-800">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-active={activeId === section.id}
                className={[
                  'block border-l-2 py-0.5 text-sm transition-colors',
                  section.level === 3 ? 'pl-5' : 'pl-3',
                  'border-transparent text-zinc-500 hover:text-zinc-200',
                  'data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-400',
                ].join(' ')}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
