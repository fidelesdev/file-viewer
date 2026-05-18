import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import type {
  FileViewerTooltipClassNames,
  FileViewerTooltipStyles,
} from '../customization-types'
import { getFileViewerDefaults } from '../config'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const FILE_VIEWER_TOOLTIP_CONTENT_DEFAULT =
  'z-[200] max-w-xs select-none rounded-md border border-neutral-700/50 bg-neutral-900/75 px-2 py-1.5 text-xs text-white/90 shadow-lg backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95'

export function FileViewerTooltipProvider({
  children,
}: {
  children: ReactNode
}) {
  const tooltipDefaults = getFileViewerDefaults().tooltip

  return (
    <Tooltip.Provider
      delayDuration={tooltipDefaults?.delayDuration ?? 400}
      skipDelayDuration={tooltipDefaults?.skipDelayDuration ?? 300}
    >
      {children}
    </Tooltip.Provider>
  )
}

export function FileViewerTooltip({
  content,
  children,
  disabled = false,
  classNames,
  styles,
}: {
  content: string
  children: ReactElement
  disabled?: boolean
  classNames?: FileViewerTooltipClassNames
  styles?: FileViewerTooltipStyles
}) {
  if (disabled) {
    return children
  }

  const tooltipDefaults = getFileViewerDefaults().tooltip

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className={mergeClassNames(
            FILE_VIEWER_TOOLTIP_CONTENT_DEFAULT,
            tooltipDefaults?.classNames?.content,
            classNames?.content,
          )}
          style={mergeStyles(
            tooltipDefaults?.styles?.content,
            styles?.content,
          )}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
