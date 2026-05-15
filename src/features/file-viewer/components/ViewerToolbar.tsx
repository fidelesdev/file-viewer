import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ViewerFloatingToolbarProps {
  children: ReactNode
  className?: string
}

export function ViewerFloatingToolbar({
  children,
  className = '',
}: ViewerFloatingToolbarProps) {
  return (
    <div
      className={`absolute bottom-4 left-1/2 z-10 flex h-[3.25rem] -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-900/60 px-4 text-white/90 shadow-lg backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function ViewerToolbarDivider() {
  return <div className="mx-1 h-full w-px bg-white/20" aria-hidden />
}

export function ViewerToolbarIconButton({
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/40 ${className}`}
      {...rest}
    />
  )
}
