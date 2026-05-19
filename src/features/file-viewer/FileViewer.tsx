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

const FILE_VIEWER_DIALOG_CONTENT_DEFAULT = 'fv-dialog-content'

const FILE_VIEWER_DIALOG_PANEL_DEFAULT = 'fv-dialog-panel'

const FILE_VIEWER_ROOT_DEFAULT = 'fv-shell-root'

const FILE_VIEWER_HEADER_DEFAULT = 'fv-shell-header'

const FILE_VIEWER_HEADER_TITLE_WRAP_DEFAULT = 'fv-shell-header-title-wrap'

const FILE_VIEWER_CLOSE_BUTTON_DEFAULT = 'fv-shell-close-button'

const FILE_VIEWER_TITLE_MODAL_DEFAULT = 'fv-shell-header-title'

const FILE_VIEWER_TITLE_INLINE_DEFAULT =
  'fv-shell-header-title fv-shell-header-title--inline'

const FILE_VIEWER_HEADER_ACTIONS_DEFAULT = 'fv-shell-header-actions'

const FILE_VIEWER_ACTION_BUTTON_DEFAULT = 'fv-shell-action-button'

const FILE_VIEWER_ACTION_BUTTON_DOWNLOAD_DEFAULT = 'fv-shell-action-button'

const FILE_VIEWER_VIEWER_DEFAULT = 'fv-shell-viewer'

const FILE_VIEWER_LOADER_DEFAULT = 'fv-icon fv-icon--xl fv-icon--spin'

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
            className={slotClassName(
              'loader',
              'fv-icon fv-icon--xl fv-icon--spin fv-icon--white',
            )}
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
            className={slotClassName(
              'loader',
              'fv-icon fv-icon--xl fv-icon--spin fv-icon--white',
            )}
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
            <X className="fv-icon fv-icon--lg" aria-hidden />
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
        <X className="fv-icon fv-icon--lg" aria-hidden />
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
                    <Maximize2 className="fv-icon fv-icon--md" aria-hidden />
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
                <Printer className="fv-icon fv-icon--md" aria-hidden />
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
                  <LoaderCircle
                    className="fv-icon fv-icon--md fv-icon--spin"
                    aria-hidden
                  />
                ) : (
                  <Download className="fv-icon fv-icon--md" aria-hidden />
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
      <div className="fv-shell-print-hidden">
        <div ref={contentRef}>
          <img src={url} className="fv-shell-print-image" alt={name} />
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
