import { type ReactNode } from 'react'

type LiveDemoProps = {
  children: ReactNode
  label?: string
  heightClass?: string
}

export function LiveDemo({
  children,
  label = 'Live preview',
  heightClass = 'h-96',
}: LiveDemoProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className={`relative ${heightClass}`}>{children}</div>
    </div>
  )
}
