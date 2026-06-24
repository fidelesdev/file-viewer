import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type DocSectionEntry = {
  id: string
  title: string
  level: 2 | 3
}

type DocSectionsContextValue = {
  sections: DocSectionEntry[]
  registerSection: (entry: DocSectionEntry) => void
  unregisterSection: (id: string) => void
}

const DocSectionsContext = createContext<DocSectionsContextValue | null>(null)

export function DocSectionsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<DocSectionEntry[]>([])

  const registerSection = useCallback((entry: DocSectionEntry) => {
    setSections((current) => {
      const without = current.filter((section) => section.id !== entry.id)
      return [...without, entry].sort((left, right) => {
        if (left.level !== right.level) {
          return left.level - right.level
        }
        return 0
      })
    })
  }, [])

  const unregisterSection = useCallback((id: string) => {
    setSections((current) => current.filter((section) => section.id !== id))
  }, [])

  const value = useMemo(
    () => ({ sections, registerSection, unregisterSection }),
    [sections, registerSection, unregisterSection],
  )

  return (
    <DocSectionsContext.Provider value={value}>
      {children}
    </DocSectionsContext.Provider>
  )
}

export function useDocSections() {
  const context = useContext(DocSectionsContext)
  if (!context) {
    throw new Error('useDocSections must be used within DocSectionsProvider')
  }
  return context
}
