import { NavLink } from 'react-router-dom'
import { docsNavigation } from '../navigation'
import { useSidebarCollapsed } from '../hooks/useSidebarCollapsed'

type DocsSidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function DocsSidebar({ mobileOpen, onMobileClose }: DocsSidebarProps) {
  const { collapsed, toggle } = useSidebarCollapsed()

  return (
    <>
      <div
        data-open={mobileOpen}
        className="fixed inset-0 z-40 bg-black/60 lg:hidden data-[open=false]:hidden"
        onClick={onMobileClose}
        aria-hidden
      />
      <aside
        data-collapsed={collapsed}
        data-mobile-open={mobileOpen}
        className="group/sidebar fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-[width,transform] duration-200 data-[collapsed=true]:w-16 data-[mobile-open=false]:-translate-x-full lg:translate-x-0 lg:data-[collapsed=true]:w-16"
        aria-label="Documentation navigation"
      >
        <div className="flex items-center justify-end border-b border-zinc-800 p-2">
          <button
            type="button"
            onClick={toggle}
            className="hidden rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-sm">{collapsed ? '»' : '«'}</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {docsNavigation.map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              <p
                className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 group-data-[collapsed=true]/sidebar:hidden"
              >
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onMobileClose}
                      className={({ isActive }) =>
                        [
                          'block rounded-md px-2 py-1.5 text-sm transition-colors',
                          'group-data-[collapsed=true]/sidebar:truncate group-data-[collapsed=true]/sidebar:px-1 group-data-[collapsed=true]/sidebar:text-center',
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                        ].join(' ')
                      }
                      title={item.title}
                    >
                      <span className="group-data-[collapsed=true]/sidebar:hidden">
                        {item.title}
                      </span>
                      <span className="hidden group-data-[collapsed=true]/sidebar:inline">
                        •
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
