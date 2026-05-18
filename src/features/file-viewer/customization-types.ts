import type { CSSProperties } from 'react'

export type SlotStyle = CSSProperties

export type ViewFileDialogClassNames = {
  backdrop?: string
  content?: string
  panel?: string
}

export type ViewFileDialogStyles = {
  backdrop?: SlotStyle
  content?: SlotStyle
  panel?: SlotStyle
}

export type ViewFileClassNames = {
  root?: string
  header?: string
  headerTitle?: string
  headerActions?: string
  closeButton?: string
  printButton?: string
  openInModalButton?: string
  downloadButton?: string
  viewer?: string
  loader?: string
  unsupported?: string
}

export type ViewFileStyles = {
  root?: SlotStyle
  header?: SlotStyle
  headerTitle?: SlotStyle
  headerActions?: SlotStyle
  closeButton?: SlotStyle
  printButton?: SlotStyle
  openInModalButton?: SlotStyle
  downloadButton?: SlotStyle
  viewer?: SlotStyle
  loader?: SlotStyle
  unsupported?: SlotStyle
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
}

export type ImageViewerClassNames = {
  root?: string
  loader?: string
  image?: string
  toolbar?: string
}

export type ImageViewerStyles = {
  root?: SlotStyle
  loader?: SlotStyle
  image?: SlotStyle
  toolbar?: SlotStyle
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
