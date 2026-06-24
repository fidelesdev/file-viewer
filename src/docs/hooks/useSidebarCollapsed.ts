import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'fv-docs-sidebar-collapsed'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  const toggle = useCallback(() => {
    setCollapsed((current) => !current)
  }, [])

  return { collapsed, toggle, setCollapsed }
}
