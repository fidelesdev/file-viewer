import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'

export function FileViewerTooltipProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Tooltip.Provider delayDuration={400} skipDelayDuration={300}>
      {children}
    </Tooltip.Provider>
  )
}

export function FileViewerTooltip({
  content,
  children,
  disabled = false,
}: {
  content: string
  children: ReactElement
  /** When true, skips the tooltip shell so the child is a plain non-interactive control (no trigger hover). */
  disabled?: boolean
}) {
  if (disabled) {
    return children
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-[200] max-w-xs select-none rounded-md border border-neutral-700/50 bg-neutral-900/75 px-2 py-1.5 text-xs text-white/90 shadow-lg backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95"
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
