'use client'

import * as Dialog from './primitives/dialog'
import {
  Download,
  LoaderCircle,
  Maximize2,
  Minimize2,
  Printer,
  X,
} from './components/icons'
import {
  type CSSProperties,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
  lazy,
} from 'react'
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
  FileViewerCloseButtonRenderProps,
  FileViewerDialogClassNames,
  FileViewerDialogStyles,
  FileViewerExtraHeaderActionsSide,
  FileViewerHeaderActionsContext,
  FileViewerHeaderActionsRenderProps,
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
  FileViewerCloseButtonContext,
  FileViewerCloseButtonRenderProps,
  FileViewerDialogClassNames,
  FileViewerDialogStyles,
  FileViewerExtraHeaderActionsSide,
  FileViewerHeaderActionsContext,
  FileViewerHeaderActionsRenderProps,
  FileViewerStyles,
} from './customization-types'

const FILE_VIEWER_DIALOG_CONTENT_DEFAULT = 'fv-dialog-content'

const FILE_VIEWER_ROOT_DEFAULT = 'fv-shell-root'

const FILE_VIEWER_HEADER_DEFAULT = 'fv-shell-header'

const FILE_VIEWER_HEADER_TITLE_WRAP_DEFAULT = 'fv-shell-header-title-wrap'

const FILE_VIEWER_CLOSE_BUTTON_DEFAULT = 'fv-shell-close-button'

const FILE_VIEWER_TITLE_MODAL_DEFAULT = 'fv-shell-header-title'

const FILE_VIEWER_TITLE_INLINE_DEFAULT =
  'fv-shell-header-title fv-shell-header-title--inline'

const FILE_VIEWER_HEADER_ACTIONS_DEFAULT = 'fv-shell-header-actions'

const FILE_VIEWER_HEADER_ACTIONS_BUILTINS_DEFAULT =
  'fv-shell-header-actions-builtins'

const FILE_VIEWER_HEADER_ACTIONS_EXTRA_DEFAULT = 'fv-shell-header-actions-extra'

const FILE_VIEWER_ACTION_BUTTON_DEFAULT = 'fv-shell-action-button'

const FILE_VIEWER_ACTION_BUTTON_DOWNLOAD_DEFAULT = 'fv-shell-action-button'

const FILE_VIEWER_VIEWER_DEFAULT = 'fv-shell-viewer'

const FILE_VIEWER_LOADER_DEFAULT = 'fv-icon fv-icon--xl fv-icon--spin'

type FileViewerPanelOptions = {
  isInlineFullscreenModal?: boolean
}

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
  showFullscreenButton?: boolean
  /** When set, called instead of the built-in modal preview. */
  onFullscreen?: () => void
  /** Show the print action in the header. Defaults to `true`. */
  showPrintButton?: boolean
  /** Show the download action in the header. Defaults to `true`. */
  showDownloadButton?: boolean
  /** Extra classes/styles on the outer shell container. */
  className?: string
  style?: CSSProperties
  classNames?: FileViewerClassNames
  styles?: FileViewerStyles
  /** Modal overlay layer classes (Dialog.Content). Ignored in inline mode. */
  dialogClassNames?: FileViewerDialogClassNames
  dialogStyles?: FileViewerDialogStyles
  /**
   * Extra header actions relative to built-in controls.
   * Ignored when `renderHeaderActions` is set.
   */
  extraHeaderActions?:
    | ReactNode
    | ((context: FileViewerHeaderActionsContext) => ReactNode)
  /**
   * Where to render `extraHeaderActions` — to the `left` or `right` of
   * built-in actions. Default `right`. Customize wrappers via
   * `classNames.headerActionsBuiltins` / `headerActionsExtra`.
   */
  extraHeaderActionsSide?: FileViewerExtraHeaderActionsSide
  /**
   * Replaces default header action assembly. Use `defaultActions` to compose
   * with or without built-in fullscreen, print, and download controls.
   */
  renderHeaderActions?: (
    props: FileViewerHeaderActionsRenderProps,
  ) => ReactNode
  /**
   * Replaces default close button assembly. Use `defaultCloseButton` to wrap
   * or return `null` to hide.
   */
  renderCloseButton?: (
    props: FileViewerCloseButtonRenderProps,
  ) => ReactNode | null
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
  showFullscreenButton: showFullscreenButtonProp,
  onFullscreen,
  showPrintButton: showPrintButtonProp,
  showDownloadButton: showDownloadButtonProp,
  className: classNameProp,
  style: styleProp,
  classNames,
  styles,
  dialogClassNames,
  dialogStyles,
  extraHeaderActions: extraHeaderActionsProp,
  extraHeaderActionsSide: extraHeaderActionsSideProp,
  renderHeaderActions: renderHeaderActionsProp,
  renderCloseButton: renderCloseButtonProp,
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

  const showFullscreenButton =
    mode === 'inline' &&
    resolveOption(
      showFullscreenButtonProp,
      globalFileViewer?.showFullscreenButton,
      true,
    )

  const showPrintButton = resolveOption(
    showPrintButtonProp,
    globalFileViewer?.showPrintButton,
    true,
  )

  const showDownloadButton = resolveOption(
    showDownloadButtonProp,
    globalFileViewer?.showDownloadButton,
    true,
  )

  const renderHeaderActions =
    renderHeaderActionsProp ?? globalFileViewer?.renderHeaderActions

  const extraHeaderActions =
    extraHeaderActionsProp ?? globalFileViewer?.extraHeaderActions

  const extraHeaderActionsSide = resolveOption(
    extraHeaderActionsSideProp,
    globalFileViewer?.extraHeaderActionsSide,
    'right',
  )

  const renderCloseButtonOverride =
    renderCloseButtonProp ?? globalFileViewer?.renderCloseButton

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

  const shellClassName = mergeClassNames(
    FILE_VIEWER_ROOT_DEFAULT,
    globalFileViewer?.className,
    classNameProp,
  )

  const shellStyle = mergeStyles(globalFileViewer?.style, styleProp)

  const contentClasses = mergeFileViewerSlotClassName(
    FILE_VIEWER_DIALOG_CONTENT_DEFAULT,
    globalFileViewer?.dialogClassNames?.content,
    dialogClassNames?.content,
  )

  const contentStyle = mergeStyles(
    globalFileViewer?.dialogStyles?.content,
    dialogStyles?.content,
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

  const handleToggleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen()
      return
    }
    setIsModalPreviewOpen((previousOpen) => !previousOpen)
  }

  const buildHeaderActionsContext = (
    activeMode: 'inline' | 'modal',
    panelOptions: FileViewerPanelOptions = {},
  ): FileViewerHeaderActionsContext => ({
    mode: activeMode,
    url,
    name,
    extension,
    isLoading: Boolean(isLoading),
    isDownloading,
    isFullscreen: Boolean(panelOptions.isInlineFullscreenModal),
    print: handlePrint,
    download: handleDownload,
    toggleFullscreen: handleToggleFullscreen,
  })

  const buildDefaultHeaderActions = (
    activeMode: 'inline' | 'modal',
    panelOptions: FileViewerPanelOptions = {},
  ): ReactNode => {
    const actions: ReactNode[] = []
    const isInlineFullscreenModal = Boolean(panelOptions.isInlineFullscreenModal)

    if (showFullscreenButton && activeMode === 'inline') {
      actions.push(
        <FileViewerTooltip key="fullscreen-enter" content={t.fileViewer.fullscreenTooltip}>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className={slotClassName(
              'fullscreenButton',
              FILE_VIEWER_ACTION_BUTTON_DEFAULT,
            )}
            style={slotStyle('fullscreenButton')}
            aria-label={t.fileViewer.fullscreenAriaLabel}
          >
            <Maximize2 className="fv-icon fv-icon--md" aria-hidden />
          </button>
        </FileViewerTooltip>,
      )
    }

    if (showFullscreenButton && isInlineFullscreenModal) {
      actions.push(
        <FileViewerTooltip
          key="fullscreen-exit"
          content={t.fileViewer.fullscreenExitTooltip}
        >
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className={slotClassName(
              'fullscreenButton',
              FILE_VIEWER_ACTION_BUTTON_DEFAULT,
            )}
            style={slotStyle('fullscreenButton')}
            aria-label={t.fileViewer.fullscreenExitAriaLabel}
          >
            <Minimize2 className="fv-icon fv-icon--md" aria-hidden />
          </button>
        </FileViewerTooltip>,
      )
    }

    if (showPrintButton) {
      actions.push(
        <FileViewerTooltip key="print" content={t.fileViewer.printTooltip}>
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
        </FileViewerTooltip>,
      )
    }

    if (showDownloadButton) {
      actions.push(
        <FileViewerTooltip
          key="download"
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
        </FileViewerTooltip>,
      )
    }

    return actions
  }

  const renderExtraHeaderActions = (
    context: FileViewerHeaderActionsContext,
  ): ReactNode => {
    if (!extraHeaderActions) {
      return null
    }

    if (typeof extraHeaderActions === 'function') {
      return extraHeaderActions(context)
    }

    return extraHeaderActions
  }

  const renderHeaderActionsArea = (
    activeMode: 'inline' | 'modal',
    panelOptions: FileViewerPanelOptions = {},
  ): ReactNode => {
    const context = buildHeaderActionsContext(activeMode, panelOptions)
    const defaultActions = buildDefaultHeaderActions(activeMode, panelOptions)

    if (renderHeaderActions) {
      return renderHeaderActions({ ...context, defaultActions })
    }

    const builtinsNode = (
      <span
        className={slotClassName(
          'headerActionsBuiltins',
          FILE_VIEWER_HEADER_ACTIONS_BUILTINS_DEFAULT,
        )}
        style={slotStyle('headerActionsBuiltins')}
      >
        {defaultActions}
      </span>
    )

    const extraNode = renderExtraHeaderActions(context)
    if (!extraNode) {
      return builtinsNode
    }

    const extraWrapper = (
      <span
        className={slotClassName(
          'headerActionsExtra',
          FILE_VIEWER_HEADER_ACTIONS_EXTRA_DEFAULT,
        )}
        style={slotStyle('headerActionsExtra')}
        data-extra-side={extraHeaderActionsSide}
      >
        {extraNode}
      </span>
    )

    if (extraHeaderActionsSide === 'left') {
      return (
        <>
          {extraWrapper}
          {builtinsNode}
        </>
      )
    }

    return (
      <>
        {builtinsNode}
        {extraWrapper}
      </>
    )
  }

  const buildDefaultCloseButton = (activeMode: 'inline' | 'modal'): ReactNode => {
    if (activeMode === 'modal') {
      return (
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label={t.fileViewer.closeAriaLabel}
            className={slotClassName(
              'closeButton',
              FILE_VIEWER_CLOSE_BUTTON_DEFAULT,
            )}
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

  const renderCloseButtonArea = (activeMode: 'inline' | 'modal'): ReactNode | null => {
    const hideClose = resolveHideCloseButton(
      hideCloseButtonProp,
      globalFileViewer?.hideCloseButton,
      activeMode,
    )

    const close = () => {
      if (activeMode === 'modal') {
        if (mode === 'inline') {
          setIsModalPreviewOpen(false)
        } else {
          onOpenChange(false)
        }
        return
      }
      onOpenChange(false)
    }

    const defaultCloseButton = hideClose ? null : buildDefaultCloseButton(activeMode)

    if (renderCloseButtonOverride) {
      return renderCloseButtonOverride({
        mode: activeMode,
        close,
        defaultCloseButton,
      })
    }

    return defaultCloseButton
  }

  const renderPanelContent = (
    activeMode: 'inline' | 'modal',
    panelOptions: FileViewerPanelOptions = {},
  ) => {
    const closeButton = renderCloseButtonArea(activeMode)

    return (
      <>
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
              {renderHeaderActionsArea(activeMode, panelOptions)}
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
      </>
    )
  }

  const renderShell = (
    activeMode: 'inline' | 'modal',
    options: { stopPropagation?: boolean; isInlineFullscreenModal?: boolean } = {},
  ) => (
    <div
      className={shellClassName}
      style={shellStyle}
      onClick={
        options.stopPropagation ? (event) => event.stopPropagation() : undefined
      }
    >
      {renderPanelContent(activeMode, {
        isInlineFullscreenModal: options.isInlineFullscreenModal,
      })}
    </div>
  )

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
          {content}
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
        {renderShell('inline')}
        {isModalPreviewOpen
          ? renderModalShell(
              isModalPreviewOpen,
              setIsModalPreviewOpen,
              renderShell('modal', {
                stopPropagation: true,
                isInlineFullscreenModal: true,
              }),
            )
          : null}
        {printOnlyNode}
      </FileViewerTooltipProvider>
    )
  }

  return (
    <FileViewerTooltipProvider>
      {renderModalShell(open, onOpenChange, renderShell('modal', { stopPropagation: true }))}
      {printOnlyNode}
    </FileViewerTooltipProvider>
  )
}
