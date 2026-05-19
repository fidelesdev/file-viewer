'use client'

import * as Dialog from './primitives/dialog'
import {
  Download,
  LoaderCircle,
  Maximize2,
  Printer,
  X,
} from './components/icons'
import { ReactNode, Suspense, useEffect, useRef, useState, lazy } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import {
  getFileViewerDefaults,
  resolveImageViewerProps,
  resolvePdfViewerProps,
} from './config'
import type {
  FileViewerClassNames,
  FileViewerDialogClassNames,
  FileViewerDialogStyles,
  FileViewerStyles,
} from './customization-types'
import type { PdfViewerProps } from './PdfViewer'
import {
  getFileViewerTranslations,
  resolveFormattedMessage,
  type ViewerLanguage,
} from './translations'
import { downloadFileFromUrl, printPdfFromUrl } from './utils/file-actions'
import { resolveHideCloseButton, resolveOption } from './utils/resolve-options'
import { mergeClassNames, mergeStyles } from './utils/merge-slot-props'

const LazyPdfViewer = lazy(() => import('./PdfViewer'))
const LazyImageViewer = lazy(() => import('./ImageViewer'))

export type {
  FileViewerClassNames,
  FileViewerDialogClassNames,
  FileViewerDialogStyles,
  FileViewerStyles,
} from './customization-types'

const FILE_VIEWER_DIALOG_BACKDROP_DEFAULT =
  'fixed inset-0 z-[100] cursor-default border-0 bg-black/80 p-0 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0'

const FILE_VIEWER_DIALOG_CONTENT_DEFAULT =
  'fixed inset-0 z-[101] flex h-full w-full min-h-0 cursor-default flex-col border-none bg-transparent p-0 shadow-none outline-none pointer-events-none duration-200 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 focus:outline-none'

const FILE_VIEWER_DIALOG_PANEL_DEFAULT =
  'pointer-events-auto flex h-full w-full min-h-0 flex-col overflow-hidden rounded-none border-0 bg-neutral-800/95 shadow-none'

const FILE_VIEWER_ROOT_DEFAULT =
  'flex min-h-0 flex-1 flex-col overflow-hidden'

const FILE_VIEWER_HEADER_DEFAULT =
  'flex w-full shrink-0 justify-between gap-2 rounded-t-lg p-4 font-medium text-white'

const FILE_VIEWER_HEADER_TITLE_WRAP_DEFAULT = 'flex items-center gap-2'

const FILE_VIEWER_CLOSE_BUTTON_DEFAULT =
  'cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 disabled:pointer-events-none'

const FILE_VIEWER_TITLE_MODAL_DEFAULT = 'truncate'

const FILE_VIEWER_TITLE_INLINE_DEFAULT = 'truncate font-semibold'

const FILE_VIEWER_HEADER_ACTIONS_DEFAULT = 'flex gap-3'

const FILE_VIEWER_ACTION_BUTTON_DEFAULT =
  'cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0'

const FILE_VIEWER_ACTION_BUTTON_DOWNLOAD_DEFAULT =
  'cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50'

const FILE_VIEWER_VIEWER_DEFAULT =
  'flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden text-white'

const FILE_VIEWER_LOADER_DEFAULT = 'size-10 animate-spin'

function mergeFileViewerSlotClassName(
  builtIn: string,
  globalValue: string | undefined,
  instanceValue: string | undefined,
): string {
  return mergeClassNames(builtIn, globalValue, instanceValue)
}

export interface FileViewerProps {
  /**
   * The display mode for the file viewer.
   * - `inline`: fits to its parent container (default)
   * - `modal`: renders as a full-screen fixed dialog overlay
   */
  mode?: 'modal' | 'inline'
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  extension: string
  url?: string
  isLoading?: boolean
  /** Optional; defaults to built-in download of `url` as `name`. */
  onDownload?: () => void
  pdfViewerProps?: Omit<PdfViewerProps, 'url' | 'language'>
  renderUnsupported?: ReactNode
  language?: ViewerLanguage
  /**
   * When omitted: hidden in `inline` mode, visible in `modal` mode.
   * Instance prop overrides global defaults from `setFileViewerDefaults`.
   */
  hideCloseButton?: boolean
  /**
   * In `inline` mode, shows a control to open the same file in a full-screen modal.
   * Defaults to `true`. Set to `false` to hide the button.
   */
  showOpenInModalButton?: boolean
  /** When set, called instead of the built-in modal preview. */
  onOpenInModal?: () => void
  classNames?: FileViewerClassNames
  styles?: FileViewerStyles
  /** Extra classes per layer; appended to package defaults (use `!` utilities to override when needed). */
  dialogClassNames?: FileViewerDialogClassNames
  dialogStyles?: FileViewerDialogStyles
}

export function FileViewer({
  mode: modeProp,
  open,
  onOpenChange,
  name,
  extension,
  url,
  isLoading,
  onDownload,
  pdfViewerProps,
  renderUnsupported,
  language: languageProp,
  hideCloseButton: hideCloseButtonProp,
  showOpenInModalButton: showOpenInModalButtonProp,
  onOpenInModal,
  classNames,
  styles,
  dialogClassNames,
  dialogStyles,
}: FileViewerProps) {
  const globalFileViewer = getFileViewerDefaults().fileViewer
  const mode = resolveOption(modeProp, globalFileViewer?.mode, 'inline')
  const language = resolveOption(
    languageProp,
    getFileViewerDefaults().language,
    'english',
  )
  const contentRef = useRef<HTMLDivElement>(null)
  const printImage = useReactToPrint({ contentRef })

  const t = getFileViewerTranslations(language)

  const ext = extension.toLowerCase()
  const isPdf = ext === 'pdf'
  const isImage = ['jpg', 'png', 'jpeg'].includes(ext)
  const supportedForPreview = isPdf || isImage

  const [isMounted, setIsMounted] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false)

  const showOpenInModalButton =
    mode === 'inline' &&
    resolveOption(
      showOpenInModalButtonProp,
      globalFileViewer?.showOpenInModalButton,
      true,
    )

  const mergedPdfViewerProps = resolvePdfViewerProps(pdfViewerProps)

  const mergedImageViewerProps = resolveImageViewerProps()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsDownloading(false)
  }, [open, url])

  useEffect(() => {
    if (!open) {
      setIsModalPreviewOpen(false)
    }
  }, [open])

  const slotClassName = (
    key: keyof FileViewerClassNames,
    builtIn: string,
  ): string =>
    mergeFileViewerSlotClassName(
      builtIn,
      globalFileViewer?.classNames?.[key],
      classNames?.[key],
    )

  const slotStyle = (key: keyof FileViewerStyles) =>
    mergeStyles(globalFileViewer?.styles?.[key], styles?.[key])

  const backdropClasses = mergeFileViewerSlotClassName(
    FILE_VIEWER_DIALOG_BACKDROP_DEFAULT,
    globalFileViewer?.dialogClassNames?.backdrop,
    dialogClassNames?.backdrop,
  )
  const contentClasses = mergeFileViewerSlotClassName(
    FILE_VIEWER_DIALOG_CONTENT_DEFAULT,
    globalFileViewer?.dialogClassNames?.content,
    dialogClassNames?.content,
  )
  const panelClasses = mergeFileViewerSlotClassName(
    FILE_VIEWER_DIALOG_PANEL_DEFAULT,
    globalFileViewer?.dialogClassNames?.panel,
    dialogClassNames?.panel,
  )

  const backdropStyle = mergeStyles(
    globalFileViewer?.dialogStyles?.backdrop,
    dialogStyles?.backdrop,
  )
  const contentStyle = mergeStyles(
    globalFileViewer?.dialogStyles?.content,
    dialogStyles?.content,
  )
  const panelStyle = mergeStyles(
    globalFileViewer?.dialogStyles?.panel,
    dialogStyles?.panel,
  )

  const renderPdf = () => {
    if (!isMounted) return null

    return (
      <Suspense
        fallback={
          <LoaderCircle
            className={slotClassName('loader', 'animate-spin size-10 text-white')}
            style={slotStyle('loader')}
          />
        }
      >
        <LazyPdfViewer url={url!} {...mergedPdfViewerProps} language={language} />
      </Suspense>
    )
  }

  const renderImage = () => {
    if (!isMounted) return null

    return (
      <Suspense
        fallback={
          <LoaderCircle
            className={slotClassName('loader', 'animate-spin size-10 text-white')}
            style={slotStyle('loader')}
          />
        }
      >
        <LazyImageViewer
          url={url!}
          name={name}
          language={language}
          {...mergedImageViewerProps}
        />
      </Suspense>
    )
  }

  const handlePrint = () => {
    if (!url) return
    if (isPdf) {
      printPdfFromUrl(url)
    } else {
      printImage()
    }
  }

  const handleDownload = async () => {
    if (!url || isDownloading) return
    setIsDownloading(true)
    try {
      if (onDownload) {
        await Promise.resolve(onDownload())
      } else {
        await downloadFileFromUrl(url, name)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOpenInModal = () => {
    if (onOpenInModal) {
      onOpenInModal()
      return
    }
    setIsModalPreviewOpen(true)
  }

  const renderCloseButton = (activeMode: 'inline' | 'modal') => {
    const hideClose = resolveHideCloseButton(
      hideCloseButtonProp,
      globalFileViewer?.hideCloseButton,
      activeMode,
    )

    if (hideClose) {
      return null
    }

    if (activeMode === 'modal') {
      return (
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label={t.fileViewer.closeAriaLabel}
            className={slotClassName('closeButton', FILE_VIEWER_CLOSE_BUTTON_DEFAULT)}
            style={slotStyle('closeButton')}
          >
            <X className="size-7" aria-hidden />
          </button>
        </Dialog.Close>
      )
    }

    return (
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label={t.fileViewer.closeAriaLabel}
        className={slotClassName('closeButton', FILE_VIEWER_CLOSE_BUTTON_DEFAULT)}
        style={slotStyle('closeButton')}
      >
        <X className="size-7" aria-hidden />
      </button>
    )
  }

  const renderPanelContent = (activeMode: 'inline' | 'modal') => {
    const closeButton = renderCloseButton(activeMode)

    return (
    <div
      className={slotClassName('root', FILE_VIEWER_ROOT_DEFAULT)}
      style={slotStyle('root')}
    >
      <div
        className={slotClassName('header', FILE_VIEWER_HEADER_DEFAULT)}
        style={slotStyle('header')}
      >
        <span className={FILE_VIEWER_HEADER_TITLE_WRAP_DEFAULT}>
          {closeButton}
          {activeMode === 'modal' ? (
            <Dialog.Title asChild>
              <p
                className={slotClassName(
                  'headerTitle',
                  FILE_VIEWER_TITLE_MODAL_DEFAULT,
                )}
                style={slotStyle('headerTitle')}
              >
                {name}
              </p>
            </Dialog.Title>
          ) : (
            <p
              className={slotClassName(
                'headerTitle',
                FILE_VIEWER_TITLE_INLINE_DEFAULT,
              )}
              style={slotStyle('headerTitle')}
            >
              {name}
            </p>
          )}
        </span>

        {url && !isLoading && supportedForPreview ? (
          <span
            className={slotClassName(
              'headerActions',
              FILE_VIEWER_HEADER_ACTIONS_DEFAULT,
            )}
            style={slotStyle('headerActions')}
          >
              {showOpenInModalButton && activeMode === 'inline' ? (
                <FileViewerTooltip content={t.fileViewer.openInModalTooltip}>
                  <button
                    type="button"
                    onClick={handleOpenInModal}
                    className={slotClassName(
                      'openInModalButton',
                      FILE_VIEWER_ACTION_BUTTON_DEFAULT,
                    )}
                    style={slotStyle('openInModalButton')}
                    aria-label={t.fileViewer.openInModalAriaLabel}
                  >
                    <Maximize2 className="size-6" aria-hidden />
                  </button>
                </FileViewerTooltip>
              ) : null}
            <FileViewerTooltip content={t.fileViewer.printTooltip}>
              <button
                type="button"
                onClick={handlePrint}
                className={slotClassName(
                  'printButton',
                  FILE_VIEWER_ACTION_BUTTON_DEFAULT,
                )}
                style={slotStyle('printButton')}
                aria-label={t.fileViewer.printAriaLabel}
              >
                <Printer className="size-6" aria-hidden />
              </button>
            </FileViewerTooltip>
            <FileViewerTooltip
              content={
                isDownloading
                  ? t.fileViewer.downloadInProgressTooltip
                  : t.fileViewer.downloadTooltip
              }
            >
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => {
                  void handleDownload()
                }}
                className={slotClassName(
                  'downloadButton',
                  FILE_VIEWER_ACTION_BUTTON_DOWNLOAD_DEFAULT,
                )}
                style={slotStyle('downloadButton')}
                aria-busy={isDownloading}
                aria-label={
                  isDownloading
                    ? t.fileViewer.downloadInProgressAriaLabel
                    : t.fileViewer.downloadAriaLabel
                }
              >
                {isDownloading ? (
                  <LoaderCircle className="size-6 animate-spin" aria-hidden />
                ) : (
                  <Download className="size-6" aria-hidden />
                )}
              </button>
            </FileViewerTooltip>
          </span>
        ) : null}
      </div>
      <div
        className={slotClassName('viewer', FILE_VIEWER_VIEWER_DEFAULT)}
        style={slotStyle('viewer')}
      >
        {!url || isLoading ? (
          <LoaderCircle
            className={slotClassName('loader', FILE_VIEWER_LOADER_DEFAULT)}
            style={slotStyle('loader')}
          />
        ) : isImage ? (
          renderImage()
        ) : isPdf ? (
          renderPdf()
        ) : (
          renderUnsupported || (
            <p
              className={slotClassName('unsupported', '')}
              style={slotStyle('unsupported')}
            >
              {resolveFormattedMessage(t.fileViewer.unsupportedFileType, {
                extension,
              })}
            </p>
          )
        )}
      </div>
    </div>
    )
  }

  const renderModalShell = (
    modalOpen: boolean,
    onModalOpenChange: (nextOpen: boolean) => void,
    content: ReactNode,
  ) => (
    <Dialog.Root open={modalOpen} onOpenChange={onModalOpenChange}>
      <Dialog.Portal>
        <Dialog.Close asChild>
          <button
            type="button"
            tabIndex={-1}
            data-visible={modalOpen}
            className={backdropClasses}
            style={backdropStyle}
            aria-hidden
          />
        </Dialog.Close>
        <Dialog.Content
          aria-describedby={undefined}
          className={contentClasses}
          style={contentStyle}
        >
          <div
            className={panelClasses}
            style={panelStyle}
            onClick={(event) => event.stopPropagation()}
          >
            {content}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

  const printOnlyNode =
    isImage && url ? (
      <div className="hidden">
        <div ref={contentRef}>
          <img src={url} className="max-h-[105dvh]" alt={name} />
        </div>
      </div>
    ) : null

  if (mode === 'inline') {
    if (!open) return null
    return (
      <FileViewerTooltipProvider>
        <div className={panelClasses} style={panelStyle}>
          {renderPanelContent('inline')}
        </div>
        {isModalPreviewOpen
          ? renderModalShell(
              isModalPreviewOpen,
              setIsModalPreviewOpen,
              renderPanelContent('modal'),
            )
          : null}
        {printOnlyNode}
      </FileViewerTooltipProvider>
    )
  }

  return (
    <FileViewerTooltipProvider>
      {renderModalShell(open, onOpenChange, renderPanelContent('modal'))}
      {printOnlyNode}
    </FileViewerTooltipProvider>
  )
}
