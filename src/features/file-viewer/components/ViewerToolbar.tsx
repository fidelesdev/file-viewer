import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import type {
  ViewerToolbarClassNames,
  ViewerToolbarStyles,
} from '../customization-types'
import { getFileViewerDefaults } from '../config'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const VIEWER_TOOLBAR_DEFAULT = 'fv-floating-toolbar'

const VIEWER_TOOLBAR_DIVIDER_DEFAULT = 'fv-toolbar-divider'

const VIEWER_TOOLBAR_ICON_BUTTON_DEFAULT = 'fv-toolbar-icon-button'

export interface ViewerToolbarCustomization {
  classNames?: ViewerToolbarClassNames
  styles?: ViewerToolbarStyles
}

export interface ViewerFloatingToolbarProps extends ViewerToolbarCustomization {
  children: ReactNode
  className?: string
  style?: CSSProperties
  'data-toolbar-visible'?: boolean
}

export const ViewerFloatingToolbar = forwardRef<
  HTMLDivElement,
  ViewerFloatingToolbarProps
>(({ children, className = '', style, classNames, styles, ...rest }, ref) => {
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
      {...rest}
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

export const ViewerToolbarIconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & ViewerToolbarCustomization
>(function ViewerToolbarIconButton(
  { className = '', style, classNames, styles, ...rest },
  ref,
) {
  const globalToolbar = getFileViewerDefaults().toolbar

  return (
    <button
      ref={ref}
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
})
ViewerToolbarIconButton.displayName = 'ViewerToolbarIconButton'
