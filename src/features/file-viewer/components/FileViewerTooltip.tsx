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
  useCloseActiveTooltip,
} from '../primitives/tooltip'
import { renderAsChild } from '../primitives/as-child'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const FILE_VIEWER_TOOLTIP_CONTENT_DEFAULT = 'fv-tooltip-content'

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

function TooltipDisabledTarget({ children }: { children: ReactElement }) {
  const closeActiveTooltip = useCloseActiveTooltip()

  return renderAsChild(true, children, {
    className: 'fv-tooltip-disabled-target',
    onMouseEnter: () => closeActiveTooltip(),
    onFocus: () => closeActiveTooltip(),
  })
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
    return <TooltipDisabledTarget>{children}</TooltipDisabledTarget>
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
