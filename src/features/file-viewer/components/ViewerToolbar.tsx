import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import type {
  ViewerToolbarClassNames,
  ViewerToolbarStyles,
} from '../customization-types'
import { getFileViewerDefaults } from '../config'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const VIEWER_TOOLBAR_DEFAULT =
  'absolute bottom-4 left-1/2 z-10 flex h-[3.25rem] -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-900/60 px-4 text-white/90 shadow-lg backdrop-blur-sm transition-opacity duration-300'

const VIEWER_TOOLBAR_DIVIDER_DEFAULT = 'mx-1 h-full w-px bg-white/20'

const VIEWER_TOOLBAR_ICON_BUTTON_DEFAULT =
  'cursor-pointer rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/40'

export interface ViewerToolbarCustomization {
  classNames?: ViewerToolbarClassNames
  styles?: ViewerToolbarStyles
}

export interface ViewerFloatingToolbarProps extends ViewerToolbarCustomization {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export const ViewerFloatingToolbar = forwardRef<
  HTMLDivElement,
  ViewerFloatingToolbarProps
>(({ children, className = '', style, classNames, styles }, ref) => {
  const globalToolbar = getFileViewerDefaults().toolbar

  return (
    <div
      ref={ref}
      className={mergeClassNames(
        VIEWER_TOOLBAR_DEFAULT,
        globalToolbar?.classNames?.toolbar,
        classNames?.toolbar,
        className,
      )}
      style={mergeStyles(globalToolbar?.styles?.toolbar, styles?.toolbar, style)}
    >
      {children}
    </div>
  )
})
ViewerFloatingToolbar.displayName = 'ViewerFloatingToolbar'

export function ViewerToolbarDivider({
  className = '',
  style,
  classNames,
  styles,
}: {
  className?: string
  style?: CSSProperties
} & ViewerToolbarCustomization) {
  const globalToolbar = getFileViewerDefaults().toolbar

  return (
    <div
      className={mergeClassNames(
        VIEWER_TOOLBAR_DIVIDER_DEFAULT,
        globalToolbar?.classNames?.divider,
        classNames?.divider,
        className,
      )}
      style={mergeStyles(globalToolbar?.styles?.divider, styles?.divider, style)}
      aria-hidden
    />
  )
}

export function ViewerToolbarIconButton({
  className = '',
  style,
  classNames,
  styles,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ViewerToolbarCustomization) {
  const globalToolbar = getFileViewerDefaults().toolbar

  return (
    <button
      type="button"
      className={mergeClassNames(
        VIEWER_TOOLBAR_ICON_BUTTON_DEFAULT,
        globalToolbar?.classNames?.iconButton,
        classNames?.iconButton,
        className,
      )}
      style={mergeStyles(
        globalToolbar?.styles?.iconButton,
        styles?.iconButton,
        style,
      )}
      {...rest}
    />
  )
}
