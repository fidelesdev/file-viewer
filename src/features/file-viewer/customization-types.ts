import type { CSSProperties, ReactNode } from 'react'

export type SlotStyle = CSSProperties

export type ViewerExtraActionsSide = 'left' | 'right'

export type FileViewerDialogClassNames = {
  /** Modal overlay layer (Dialog.Content). Ignored in inline mode. */
  content?: string
}

export type FileViewerDialogStyles = {
  content?: SlotStyle
}

export type FileViewerExtraHeaderActionsSide = ViewerExtraActionsSide

export type FileViewerClassNames = {
  header?: string
  headerTitle?: string
  headerActions?: string
  headerActionsBuiltins?: string
  headerActionsExtra?: string
  closeButton?: string
  printButton?: string
  fullscreenButton?: string
  downloadButton?: string
  viewer?: string
  loader?: string
  unsupported?: string
}

export type FileViewerStyles = {
  header?: SlotStyle
  headerTitle?: SlotStyle
  headerActions?: SlotStyle
  headerActionsBuiltins?: SlotStyle
  headerActionsExtra?: SlotStyle
  closeButton?: SlotStyle
  printButton?: SlotStyle
  fullscreenButton?: SlotStyle
  downloadButton?: SlotStyle
  viewer?: SlotStyle
  loader?: SlotStyle
  unsupported?: SlotStyle
}

export type FileViewerHeaderActionsContext = {
  mode: 'inline' | 'modal'
  url?: string
  name: string
  extension: string
  isLoading: boolean
  isDownloading: boolean
  /** `true` when inline preview is open in the full-screen modal. */
  isFullscreen: boolean
  print: () => void
  download: () => Promise<void>
  toggleFullscreen: () => void
}

export type FileViewerHeaderActionsRenderProps =
  FileViewerHeaderActionsContext & {
    /** Built-in fullscreen, print, and download actions (respecting toggles). */
    defaultActions: ReactNode
  }

export type FileViewerCloseButtonContext = {
  mode: 'inline' | 'modal'
  close: () => void
}

export type FileViewerCloseButtonRenderProps = FileViewerCloseButtonContext & {
  /** Default close button (Dialog.Close in modal, onClick in inline). */
  defaultCloseButton: ReactNode
}

export type PdfToolbarActionsContext = {
  pageNumber: number
  numPages: number
  viewMode: 'single' | 'continuous'
  isFirstPage: boolean
  isLastPage: boolean
  previousPage: () => void
  nextPage: () => void
  goToPage: (page: number) => void
  zoomIn: () => void
  zoomOut: () => void
  zoomReset: () => void
}

export type PdfToolbarActionsRenderProps = PdfToolbarActionsContext & {
  defaultActions: ReactNode
}

export type ImageToolbarActionsContext = {
  scale: number
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
}

export type ImageToolbarActionsRenderProps = ImageToolbarActionsContext & {
  defaultActions: ReactNode
}

export type PdfViewerClassNames = {
  root?: string
  scrollArea?: string
  scrollViewport?: string
  scrollbar?: string
  scrollbarThumb?: string
  page?: string
  pageInner?: string
  pageInput?: string
  pagination?: string
  toolbarBuiltins?: string
  toolbarExtra?: string
}

export type PdfViewerStyles = {
  root?: SlotStyle
  scrollArea?: SlotStyle
  scrollViewport?: SlotStyle
  scrollbar?: SlotStyle
  scrollbarThumb?: SlotStyle
  page?: SlotStyle
  pageInner?: SlotStyle
  pageInput?: SlotStyle
  pagination?: SlotStyle
  toolbarBuiltins?: SlotStyle
  toolbarExtra?: SlotStyle
}

export type ImageViewerClassNames = {
  root?: string
  loader?: string
  image?: string
  toolbar?: string
  toolbarBuiltins?: string
  toolbarExtra?: string
}

export type ImageViewerStyles = {
  root?: SlotStyle
  loader?: SlotStyle
  image?: SlotStyle
  toolbar?: SlotStyle
  toolbarBuiltins?: SlotStyle
  toolbarExtra?: SlotStyle
}

export type ViewerToolbarClassNames = {
  toolbar?: string
  divider?: string
  iconButton?: string
}

export type ViewerToolbarStyles = {
  toolbar?: SlotStyle
  divider?: SlotStyle
  iconButton?: SlotStyle
}

export type FileViewerTooltipClassNames = {
  content?: string
}

export type FileViewerTooltipStyles = {
  content?: SlotStyle
}

export type MultiFileViewerLayout = 'sidebar' | 'stack'

export type MultiFileViewerStackPosition = 'top' | 'bottom'

export type MultiFileViewerClassNames = {
  root?: string
  body?: string
  fileListShell?: string
  fileListToolbar?: string
  fileList?: string
  fileListHeader?: string
  fileListCollapseButton?: string
  fileListItem?: string
  fileListItemWrap?: string
  fileListItemIcon?: string
  fileListItemLabel?: string
  preview?: string
  empty?: string
}

export type MultiFileViewerStyles = {
  root?: SlotStyle
  body?: SlotStyle
  fileListShell?: SlotStyle
  fileListToolbar?: SlotStyle
  fileList?: SlotStyle
  fileListHeader?: SlotStyle
  fileListCollapseButton?: SlotStyle
  fileListItem?: SlotStyle
  fileListItemWrap?: SlotStyle
  fileListItemIcon?: SlotStyle
  fileListItemLabel?: SlotStyle
  preview?: SlotStyle
  empty?: SlotStyle
}

export type MultiFileViewerDialogClassNames = {
  content?: string
}

export type MultiFileViewerDialogStyles = {
  content?: SlotStyle
}

export type FileListHeaderContext = {
  files: readonly { name: string; extension: string; url: string; id?: string }[]
  activeIndex: number
  layout: MultiFileViewerLayout
  fileListCollapsed: boolean
}

export type FileListItemRenderProps = {
  file: { name: string; extension: string; url: string; id?: string }
  index: number
  isActive: boolean
  select: () => void
  defaultItem: ReactNode
}

export type FileListRenderProps = {
  files: readonly { name: string; extension: string; url: string; id?: string }[]
  activeIndex: number
  onSelect: (index: number) => void
  defaultList: ReactNode
  layout: MultiFileViewerLayout
  fileListCollapsed: boolean
}
