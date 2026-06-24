import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DocSectionsProvider } from '../context/DocSectionsContext'
import { DocsSidebar } from './DocsSidebar'
import { DocsOnThisPage } from './DocsOnThisPage'
import { useSidebarCollapsed } from '../hooks/useSidebarCollapsed'

export function DocsLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { collapsed } = useSidebarCollapsed()

  const mainPadding = collapsed ? 'lg:pl-16' : 'lg:pl-64'

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-4 border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur">
        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-100">@fdls/file-viewer</span>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
            docs
          </span>
        </div>
      </header>

      <DocsSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <DocSectionsProvider>
        <div className={`flex pt-14 ${mainPadding}`}>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          <div className="hidden shrink-0 pr-6 xl:block">
            <DocsOnThisPage />
          </div>
        </div>
      </DocSectionsProvider>
    </div>
  )
}
