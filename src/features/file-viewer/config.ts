import type {
  FileViewerTooltipClassNames,
  FileViewerTooltipStyles,
  ImageViewerClassNames,
  ImageViewerStyles,
  PdfViewerClassNames,
  PdfViewerStyles,
  FileViewerClassNames,
  FileViewerDialogClassNames,
  FileViewerDialogStyles,
  FileViewerExtraHeaderActionsSide,
  FileViewerHeaderActionsContext,
  FileViewerHeaderActionsRenderProps,
  FileViewerCloseButtonRenderProps,
  FileViewerStyles,
  ImageToolbarActionsContext,
  ImageToolbarActionsRenderProps,
  PdfToolbarActionsContext,
  PdfToolbarActionsRenderProps,
  ViewerToolbarClassNames,
  ViewerToolbarStyles,
} from './customization-types'
import type { CSSProperties, ReactNode } from 'react'
import type { ImageViewerProps } from './ImageViewer'
import type { PdfViewerProps } from './PdfViewer'
import type {
  FileViewerTranslations,
  ViewerLanguage,
} from './translations'
import type { DeepPartial } from './utils/deep-partial'
import { deepMergePartial } from './utils/deep-partial'
import {
  mergeSlotClassNames,
  mergeSlotStyles,
} from './utils/merge-slot-props'

export interface FileViewerDefaults {
  language?: ViewerLanguage

  fileViewer?: {
    mode?: 'modal' | 'inline'
    hideCloseButton?: boolean
    showFullscreenButton?: boolean
    showPrintButton?: boolean
    showDownloadButton?: boolean
    className?: string
    style?: CSSProperties
    dialogClassNames?: FileViewerDialogClassNames
    dialogStyles?: FileViewerDialogStyles
    classNames?: FileViewerClassNames
    styles?: FileViewerStyles
    extraHeaderActions?:
      | ReactNode
      | ((context: FileViewerHeaderActionsContext) => ReactNode)
    /** Side of built-in controls for `extraHeaderActions`. Default `right`. */
    extraHeaderActionsSide?: FileViewerExtraHeaderActionsSide
    renderHeaderActions?: (
      props: FileViewerHeaderActionsRenderProps,
    ) => ReactNode
    renderCloseButton?: (
      props: FileViewerCloseButtonRenderProps,
    ) => ReactNode | null
    extraToolbarActions?:
      | ReactNode
      | ((context: PdfToolbarActionsContext) => ReactNode)
      | ((context: ImageToolbarActionsContext) => ReactNode)
    extraToolbarActionsSide?: FileViewerExtraHeaderActionsSide
    renderToolbarActions?:
      | ((props: PdfToolbarActionsRenderProps) => ReactNode)
      | ((props: ImageToolbarActionsRenderProps) => ReactNode)
    pdfViewerProps?: Omit<PdfViewerProps, 'url' | 'language'>
  }

  pdfViewer?: Omit<PdfViewerProps, 'url' | 'language'>
  imageViewer?: Omit<ImageViewerProps, 'url' | 'name' | 'language'>

  toolbar?: {
    classNames?: ViewerToolbarClassNames
    styles?: ViewerToolbarStyles
  }

  tooltip?: {
    delayDuration?: number
    skipDelayDuration?: number
    classNames?: FileViewerTooltipClassNames
    styles?: FileViewerTooltipStyles
  }

  autoHide?: {
    proximityThreshold?: number
    timeout?: number
  }

  translations?: DeepPartial<Record<ViewerLanguage, FileViewerTranslations>>
}

let globalDefaults: FileViewerDefaults = {}

function mergePdfViewerLayer(
  current: Omit<PdfViewerProps, 'url' | 'language'> | undefined,
  partial: Omit<PdfViewerProps, 'url' | 'language'> | undefined,
): Omit<PdfViewerProps, 'url' | 'language'> | undefined {
  if (!partial) {
    return current
  }

  return {
    ...current,
    ...partial,
    classNames: mergeSlotClassNames<PdfViewerClassNames>(
      current?.classNames,
      partial.classNames,
    ),
    styles: mergeSlotStyles<PdfViewerStyles>(current?.styles, partial.styles),
  }
}

function mergeFileViewerDefaults(
  current: FileViewerDefaults['fileViewer'],
  partial: NonNullable<FileViewerDefaults['fileViewer']>,
): FileViewerDefaults['fileViewer'] {
  return {
    ...current,
    ...partial,
    dialogClassNames: mergeSlotClassNames(
      current?.dialogClassNames,
      partial.dialogClassNames,
    ),
    dialogStyles: mergeSlotStyles(current?.dialogStyles, partial.dialogStyles),
    classNames: mergeSlotClassNames(current?.classNames, partial.classNames),
    styles: mergeSlotStyles(current?.styles, partial.styles),
    pdfViewerProps: mergePdfViewerLayer(current?.pdfViewerProps, partial.pdfViewerProps),
  }
}

function mergeImageViewerDefaults(
  current: FileViewerDefaults['imageViewer'],
  partial: NonNullable<FileViewerDefaults['imageViewer']>,
): FileViewerDefaults['imageViewer'] {
  return {
    ...current,
    ...partial,
    classNames: mergeSlotClassNames<ImageViewerClassNames>(
      current?.classNames,
      partial.classNames,
    ),
    styles: mergeSlotStyles<ImageViewerStyles>(current?.styles, partial.styles),
  }
}

function mergeToolbarDefaults(
  current: FileViewerDefaults['toolbar'],
  partial: NonNullable<FileViewerDefaults['toolbar']>,
): FileViewerDefaults['toolbar'] {
  return {
    ...current,
    ...partial,
    classNames: mergeSlotClassNames(current?.classNames, partial.classNames),
    styles: mergeSlotStyles(current?.styles, partial.styles),
  }
}

function mergeTooltipDefaults(
  current: FileViewerDefaults['tooltip'],
  partial: NonNullable<FileViewerDefaults['tooltip']>,
): FileViewerDefaults['tooltip'] {
  return {
    ...current,
    ...partial,
    classNames: mergeSlotClassNames(current?.classNames, partial.classNames),
    styles: mergeSlotStyles(current?.styles, partial.styles),
  }
}

function mergeTranslationDefaults(
  current: FileViewerDefaults['translations'],
  partial: NonNullable<FileViewerDefaults['translations']>,
): FileViewerDefaults['translations'] {
  const next: NonNullable<FileViewerDefaults['translations']> = {
    ...current,
  }

  for (const language of Object.keys(partial) as ViewerLanguage[]) {
    const patch = partial[language]
    if (!patch) {
      continue
    }
    next[language] = deepMergePartial(
      (next[language] ?? {}) as FileViewerTranslations,
      patch,
    )
  }

  return next
}

export function setFileViewerDefaults(partial: DeepPartial<FileViewerDefaults>): void {
  const next: FileViewerDefaults = { ...globalDefaults }

  if (partial.language !== undefined) {
    next.language = partial.language
  }

  if (partial.fileViewer) {
    next.fileViewer = mergeFileViewerDefaults(
      next.fileViewer,
      partial.fileViewer as NonNullable<FileViewerDefaults['fileViewer']>,
    )
  }

  if (partial.pdfViewer) {
    next.pdfViewer = mergePdfViewerLayer(
      next.pdfViewer,
      partial.pdfViewer as NonNullable<FileViewerDefaults['pdfViewer']>,
    )
  }

  if (partial.imageViewer) {
    next.imageViewer = mergeImageViewerDefaults(
      next.imageViewer,
      partial.imageViewer as NonNullable<FileViewerDefaults['imageViewer']>,
    )
  }

  if (partial.toolbar) {
    next.toolbar = mergeToolbarDefaults(
      next.toolbar,
      partial.toolbar as NonNullable<FileViewerDefaults['toolbar']>,
    )
  }

  if (partial.tooltip) {
    next.tooltip = mergeTooltipDefaults(
      next.tooltip,
      partial.tooltip as NonNullable<FileViewerDefaults['tooltip']>,
    )
  }

  if (partial.autoHide) {
    next.autoHide = { ...next.autoHide, ...partial.autoHide }
  }

  if (partial.translations) {
    next.translations = mergeTranslationDefaults(
      next.translations,
      partial.translations,
    )
  }

  globalDefaults = next
}

export function getFileViewerDefaults(): Readonly<FileViewerDefaults> {
  return globalDefaults
}

export function resetFileViewerDefaults(): void {
  globalDefaults = {}
}

export function resolvePdfViewerProps(
  instance: Omit<PdfViewerProps, 'url' | 'language'> = {},
): Omit<PdfViewerProps, 'url' | 'language'> {
  const defaults = getFileViewerDefaults()
  const merged =
    mergePdfViewerLayer(
      mergePdfViewerLayer(defaults.pdfViewer, defaults.fileViewer?.pdfViewerProps),
      instance,
    ) ?? {}

  const legacyClassNames: Partial<PdfViewerClassNames> = {
    ...(instance.className || merged.className
      ? { root: instance.className ?? merged.className }
      : {}),
    ...(instance.pageClassName || merged.pageClassName
      ? { page: instance.pageClassName ?? merged.pageClassName }
      : {}),
    ...(instance.paginationClassName || merged.paginationClassName
      ? {
          pagination:
            instance.paginationClassName ?? merged.paginationClassName,
        }
      : {}),
  }

  return {
    ...merged,
    classNames: mergeSlotClassNames<PdfViewerClassNames>(
      merged.classNames,
      legacyClassNames,
    ),
  }
}

export function resolveImageViewerProps(
  instance: Omit<ImageViewerProps, 'url' | 'name' | 'language'> = {},
): Omit<ImageViewerProps, 'url' | 'name' | 'language'> {
  const defaults = getFileViewerDefaults()
  const merged = mergeImageViewerDefaults(defaults.imageViewer, instance) ?? {}

  return merged
}

export type { DeepPartial }
