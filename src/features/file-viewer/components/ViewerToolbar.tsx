import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ViewerFloatingToolbarProps {
  children: ReactNode
  /** compact: image viewer; comfortable: continuous PDF pagination */
  density?: 'compact' | 'comfortable'
  className?: string
}

export function ViewerFloatingToolbar({
  children,
  density = 'compact',
  className = '',
}: ViewerFloatingToolbarProps) {
  return (
    <div
      data-density={density}
      className={`absolute left-1/2 -translate-x-1/2 z-10 flex items-center rounded-full border border-neutral-700/50 bg-neutral-900/60 text-white/90 shadow-lg backdrop-blur-sm data-[density=compact]:bottom-4 data-[density=compact]:gap-2 data-[density=compact]:px-4 data-[density=compact]:py-2 data-[density=comfortable]:bottom-6 data-[density=comfortable]:gap-4 data-[density=comfortable]:px-6 data-[density=comfortable]:py-3 data-[density=comfortable]:text-sm data-[density=comfortable]:font-medium ${className}`}
    >
      {children}
    </div>
  )
}

export function ViewerToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-white/20" aria-hidden />
}

export function ViewerToolbarIconButton({
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/40 ${className}`}
      {...rest}
    />
  )
}
