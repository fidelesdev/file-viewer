import type { ReactElement, ReactNode } from 'react'
import type {
  FileViewerTooltipClassNames,
  FileViewerTooltipStyles,
} from '../customization-types'
import { getFileViewerDefaults } from '../config'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from '../primitives/tooltip'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const FILE_VIEWER_TOOLTIP_CONTENT_DEFAULT =
  'select-none rounded-md border border-neutral-700/50 bg-neutral-900/75 px-2 py-1.5 text-xs text-white/90 shadow-lg backdrop-blur-sm'

export function FileViewerTooltipProvider({
  children,
}: {
  children: ReactNode
}) {
  const tooltipDefaults = getFileViewerDefaults().tooltip

  return (
    <TooltipProvider
      delayDuration={tooltipDefaults?.delayDuration ?? 300}
      skipDelayDuration={tooltipDefaults?.skipDelayDuration ?? 500}
    >
      {children}
    </TooltipProvider>
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
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
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
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  )
}
