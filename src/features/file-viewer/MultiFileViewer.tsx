'use client'

import * as Dialog from './primitives/dialog'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FileViewer, type FileViewerProps } from './FileViewer'
import {
  FileListPanel,
  type ViewerFileListItem,
} from './components/FileListPanel'
import { FileViewerTooltipProvider } from './components/FileViewerTooltip'
import {
  getFileViewerDefaults,
  resolveMultiFileViewerProps,
  resolvePdfViewerProps,
} from './config'
import { useControllableBoolean } from './hooks/useControllableBoolean'
import { useControllableIndex } from './hooks/useControllableIndex'
import type {
  FileListHeaderContext,
  FileListItemRenderProps,
  FileListRenderProps,
  MultiFileViewerClassNames,
  MultiFileViewerDialogClassNames,
  MultiFileViewerDialogStyles,
  MultiFileViewerLayout,
  MultiFileViewerStackPosition,
  MultiFileViewerStyles,
} from './customization-types'
import type { PdfViewerProps } from './PdfViewer'
import { getFileViewerTranslations } from './translations'
import { resolveOption } from './utils/resolve-options'
import { mergeClassNames, mergeStyles } from './utils/merge-slot-props'
import { getViewerFileKey } from './utils/viewer-file-utils'

const MULTI_FILE_ROOT_DEFAULT = 'fv-multi-file-root'
const MULTI_FILE_BODY_DEFAULT = 'fv-multi-file-body'
const MULTI_FILE_PREVIEW_DEFAULT = 'fv-multi-file-preview'
const MULTI_FILE_EMPTY_DEFAULT = 'fv-multi-file-empty'
const MULTI_FILE_DIALOG_CONTENT_DEFAULT = 'fv-dialog-content'

export type ViewerFileItem = {
  id?: string
  name: string
  extension: string
  url: string
  pdfViewerProps?: Omit<PdfViewerProps, 'url' | 'language'>
}

export type MultiFileViewerProps = Omit<
  FileViewerProps,
  'name' | 'extension' | 'url'
> & {
  files: ViewerFileItem[]
  layout?: MultiFileViewerLayout
  stackPosition?: MultiFileViewerStackPosition
  activeIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (index: number, file: ViewerFileItem) => void
  hideFileListWhenSingle?: boolean
  fileListCollapsible?: boolean
  fileListCollapsed?: boolean
  defaultFileListCollapsed?: boolean
  onFileListCollapsedChange?: (collapsed: boolean) => void
  classNames?: MultiFileViewerClassNames
  styles?: MultiFileViewerStyles
  dialogClassNames?: MultiFileViewerDialogClassNames
  dialogStyles?: MultiFileViewerDialogStyles
  extraFileListHeader?:
    | ReactNode
    | ((context: FileListHeaderContext) => ReactNode)
  renderFileListItem?: (props: FileListItemRenderProps) => ReactNode
  renderFileList?: (props: FileListRenderProps) => ReactNode
}

export type {
  MultiFileViewerClassNames,
  MultiFileViewerDialogClassNames,
  MultiFileViewerDialogStyles,
  MultiFileViewerLayout,
  MultiFileViewerStackPosition,
  MultiFileViewerStyles,
  FileListHeaderContext,
  FileListItemRenderProps,
  FileListRenderProps,
} from './customization-types'

function mergeMultiFileSlotClassName(
  builtIn: string,
  globalValue: string | undefined,
  instanceValue: string | undefined,
): string {
  return mergeClassNames(builtIn, globalValue, instanceValue)
}

function resolveBodyModifier(layout: MultiFileViewerLayout): string {
  if (layout === 'sidebar') {
    return `${MULTI_FILE_BODY_DEFAULT}--sidebar`
  }

  return `${MULTI_FILE_BODY_DEFAULT}--stack`
}

export function MultiFileViewer({
  files,
  layout: layoutProp,
  stackPosition: stackPositionProp,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  hideFileListWhenSingle: hideFileListWhenSingleProp,
  fileListCollapsible: fileListCollapsibleProp,
  fileListCollapsed: fileListCollapsedProp,
  defaultFileListCollapsed = false,
  onFileListCollapsedChange,
  className: classNameProp,
  style: styleProp,
  classNames: classNamesProp,
  styles: stylesProp,
  dialogClassNames: dialogClassNamesProp,
  dialogStyles: dialogStylesProp,
  extraFileListHeader: extraFileListHeaderProp,
  renderFileListItem: renderFileListItemProp,
  renderFileList: renderFileListProp,
  mode: modeProp,
  open,
  onOpenChange,
  pdfViewerProps,
  language: languageProp,
  ...fileViewerProps
}: MultiFileViewerProps) {
  const globalMultiFileViewer = getFileViewerDefaults().multiFileViewer
  const globalFileViewer = getFileViewerDefaults().fileViewer

  const resolved = resolveMultiFileViewerProps({
    layout: layoutProp,
    stackPosition: stackPositionProp,
    hideFileListWhenSingle: hideFileListWhenSingleProp,
    fileListCollapsible: fileListCollapsibleProp,
    className: classNameProp,
    style: styleProp,
    classNames: classNamesProp,
    styles: stylesProp,
    dialogClassNames: dialogClassNamesProp,
    dialogStyles: dialogStylesProp,
    extraFileListHeader: extraFileListHeaderProp,
    renderFileListItem: renderFileListItemProp,
    renderFileList: renderFileListProp,
  })

  const mode = resolveOption(modeProp, globalFileViewer?.mode, 'inline')
  const language = resolveOption(
    languageProp,
    getFileViewerDefaults().language,
    'english',
  )

  const translations = getFileViewerTranslations(language)

  const [activeIndex, setActiveIndexState] = useControllableIndex({
    value: activeIndexProp,
    defaultValue: defaultActiveIndex,
    maxIndex: files.length,
  })

  const [fileListCollapsed, setFileListCollapsed] = useControllableBoolean({
    value: fileListCollapsedProp,
    defaultValue: defaultFileListCollapsed,
    onChange: onFileListCollapsedChange,
  })

  const [isInlineFullscreenOpen, setIsInlineFullscreenOpen] = useState(false)

  const handleOpenInlineFullscreen = useCallback(() => {
    setIsInlineFullscreenOpen(true)
  }, [])

  const handleCloseInlineFullscreen = useCallback(() => {
    setIsInlineFullscreenOpen(false)
  }, [])

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndexState(index)
      const file = files[index]
      if (file) {
        onActiveIndexChange?.(index, file)
      }
    },
    [files, onActiveIndexChange, setActiveIndexState],
  )

  useEffect(() => {
    if (activeIndexProp !== undefined) {
      return
    }

    if (files.length === 0) {
      return
    }

    const clamped = Math.min(Math.max(activeIndex, 0), files.length - 1)
    if (clamped !== activeIndex) {
      setActiveIndexState(clamped)
    }
  }, [activeIndex, activeIndexProp, files.length, setActiveIndexState])

  const activeFile = files[activeIndex]

  const showFileList =
    !(resolved.hideFileListWhenSingle && files.length <= 1) && files.length > 0

  const slotClassName = (
    key: keyof MultiFileViewerClassNames,
    builtIn: string,
  ): string =>
    mergeMultiFileSlotClassName(
      builtIn,
      globalMultiFileViewer?.classNames?.[key],
      resolved.classNames[key],
    )

  const slotStyle = (key: keyof MultiFileViewerStyles) =>
    mergeStyles(globalMultiFileViewer?.styles?.[key], resolved.styles[key])

  const resolveRootClassName = (fullscreenShell = false) =>
    mergeClassNames(
      MULTI_FILE_ROOT_DEFAULT,
      mode === 'modal' || fullscreenShell
        ? `${MULTI_FILE_ROOT_DEFAULT}--modal`
        : undefined,
      globalMultiFileViewer?.className,
      resolved.className,
      resolved.classNames.root,
    )

  const rootStyle = mergeStyles(
    globalMultiFileViewer?.style,
    resolved.style,
    styleProp,
    resolved.styles.root,
  )

  const dialogContentClassName = mergeMultiFileSlotClassName(
    MULTI_FILE_DIALOG_CONTENT_DEFAULT,
    globalMultiFileViewer?.dialogClassNames?.content,
    resolved.dialogClassNames.content ??
      dialogClassNamesProp?.content ??
      globalFileViewer?.dialogClassNames?.content,
  )

  const dialogContentStyle = mergeStyles(
    globalMultiFileViewer?.dialogStyles?.content,
    resolved.dialogStyles.content,
    dialogStylesProp?.content,
    globalFileViewer?.dialogStyles?.content,
  )

  const bodyModifier = resolveBodyModifier(resolved.layout)

  const mergedPdfViewerProps = useMemo(() => {
    if (!activeFile) {
      return resolvePdfViewerProps(pdfViewerProps)
    }

    return resolvePdfViewerProps({
      ...pdfViewerProps,
      ...activeFile.pdfViewerProps,
    })
  }, [activeFile, pdfViewerProps])

  const renderPreview = (previewOptions?: {
    inlineFullscreenActive?: boolean
    onFullscreen?: () => void
  }) => {
    if (files.length === 0 || !activeFile) {
      return (
        <div
          className={slotClassName('empty', MULTI_FILE_EMPTY_DEFAULT)}
          style={slotStyle('empty')}
        >
          {translations.multiFileViewer.emptyFilesMessage}
        </div>
      )
    }

    return (
      <FileViewer
        key={getViewerFileKey(activeFile, activeIndex)}
        {...fileViewerProps}
        mode="inline"
        open
        onOpenChange={onOpenChange}
        name={activeFile.name}
        extension={activeFile.extension}
        url={activeFile.url}
        language={language}
        pdfViewerProps={mergedPdfViewerProps}
        className="fv-multi-file-inner-viewer"
        style={{ height: '100%', width: '100%', minHeight: 0 }}
        inlineFullscreenActive={previewOptions?.inlineFullscreenActive}
        onFullscreen={previewOptions?.onFullscreen}
      />
    )
  }

  const fileListNode = showFileList ? (
    <FileListPanel
      files={files as readonly ViewerFileListItem[]}
      activeIndex={activeIndex}
      layout={resolved.layout}
      onSelect={handleSelect}
      translations={translations.multiFileViewer}
      classNames={resolved.classNames}
      styles={resolved.styles}
      extraFileListHeader={resolved.extraFileListHeader}
      renderFileListItem={resolved.renderFileListItem}
      renderFileList={resolved.renderFileList}
      collapsible={resolved.fileListCollapsible}
      collapsed={fileListCollapsed}
      onCollapsedChange={setFileListCollapsed}
    />
  ) : null

  const renderContent = (contentOptions?: { fullscreenShell?: boolean }) => (
    <div
      className={resolveRootClassName(contentOptions?.fullscreenShell)}
      style={rootStyle}
    >
      <div
        className={mergeClassNames(
          MULTI_FILE_BODY_DEFAULT,
          bodyModifier,
          resolved.classNames.body,
        )}
        style={slotStyle('body')}
        data-stack-position={resolved.layout === 'stack' ? resolved.stackPosition : undefined}
      >
        {fileListNode}
        <div
          className={slotClassName('preview', MULTI_FILE_PREVIEW_DEFAULT)}
          style={slotStyle('preview')}
        >
          {renderPreview({
            inlineFullscreenActive: contentOptions?.fullscreenShell,
            onFullscreen: contentOptions?.fullscreenShell
              ? handleCloseInlineFullscreen
              : handleOpenInlineFullscreen,
          })}
        </div>
      </div>
    </div>
  )

  if (mode === 'inline') {
    if (!open) {
      return null
    }

    return (
      <FileViewerTooltipProvider>
        {renderContent()}
        {isInlineFullscreenOpen ? (
          <Dialog.Root
            open={isInlineFullscreenOpen}
            onOpenChange={setIsInlineFullscreenOpen}
          >
            <Dialog.Portal>
              <Dialog.Content
                aria-describedby={undefined}
                className={dialogContentClassName}
                style={dialogContentStyle as CSSProperties}
              >
                {renderContent({ fullscreenShell: true })}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ) : null}
      </FileViewerTooltipProvider>
    )
  }

  return (
    <FileViewerTooltipProvider>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Content
            aria-describedby={undefined}
            className={dialogContentClassName}
            style={dialogContentStyle as CSSProperties}
          >
            {renderContent()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </FileViewerTooltipProvider>
  )
}
