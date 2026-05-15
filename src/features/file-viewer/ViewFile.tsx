import * as Dialog from '@radix-ui/react-dialog'
import { Download, LoaderCircle, Printer, X } from 'lucide-react'
import { ReactNode, Suspense, useEffect, useRef, useState, lazy } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { PdfViewerProps } from './PdfViewer'
import {
  getFileViewerTranslations,
  resolveFormattedMessage,
  type ViewerLanguage,
} from './translations'
import { downloadFileFromUrl, printPdfFromUrl } from './utils/file-actions'

const LazyPdfViewer = lazy(() => import('./PdfViewer'))
const LazyImageViewer = lazy(() => import('./ImageViewer'))

/** Optional Tailwind (or other) classes merged after the built-in defaults for each dialog layer. */
export type ViewFileDialogClassNames = {
  /** Full-screen scrim behind the panel (`Dialog.Close` trigger). */
  backdrop?: string
  /** Radix `Dialog.Content` root (pointer-events bridge; default transparent). */
  content?: string
  /** Inner shell: header + viewer (default full viewport). */
  panel?: string
}

const VIEW_FILE_DIALOG_BACKDROP_DEFAULT =
  'fixed inset-0 z-50 cursor-default border-0 bg-black/80 p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'

const VIEW_FILE_DIALOG_CONTENT_DEFAULT =
  'fixed inset-0 z-[51] flex h-full w-full min-h-0 cursor-default flex-col border-none bg-transparent p-0 shadow-none outline-none pointer-events-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 focus:outline-none'

const VIEW_FILE_DIALOG_PANEL_DEFAULT =
  'pointer-events-auto flex h-full w-full min-h-0 flex-col overflow-hidden rounded-none border-0 bg-neutral-800/95 shadow-none'

function mergeDialogLayer(defaults: string, extra?: string): string {
  return extra ? `${defaults} ${extra}` : defaults
}

export interface ViewFileProps {
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
  /** Extra classes per layer; appended to package defaults (use `!` utilities to override when needed). */
  dialogClassNames?: ViewFileDialogClassNames
}

export function ViewFile({
  open,
  onOpenChange,
  name,
  extension,
  url,
  isLoading,
  onDownload,
  pdfViewerProps,
  renderUnsupported,
  language = 'english',
  dialogClassNames,
}: ViewFileProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const printImage = useReactToPrint({ contentRef })

  const t = getFileViewerTranslations(language)

  const ext = extension.toLowerCase()
  const isPdf = ext === 'pdf'
  const isImage = ['jpg', 'png', 'jpeg'].includes(ext)
  const supportedForPreview = isPdf || isImage

  const [isMounted, setIsMounted] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsDownloading(false)
  }, [open, url])

  const renderPdf = () => {
    if (!isMounted) return null

    return (
      <Suspense
        fallback={<LoaderCircle className="animate-spin size-10 text-white" />}
      >
        <LazyPdfViewer
          url={url!}
          {...(pdfViewerProps ?? {})}
          language={language}
        />
      </Suspense>
    )
  }

  const renderImage = () => {
    if (!isMounted) return null

    return (
      <Suspense
        fallback={<LoaderCircle className="animate-spin size-10 text-white" />}
      >
        <LazyImageViewer url={url!} name={name} language={language} />
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

  const backdropClasses = mergeDialogLayer(
    VIEW_FILE_DIALOG_BACKDROP_DEFAULT,
    dialogClassNames?.backdrop,
  )
  const contentClasses = mergeDialogLayer(
    VIEW_FILE_DIALOG_CONTENT_DEFAULT,
    dialogClassNames?.content,
  )
  const panelClasses = mergeDialogLayer(
    VIEW_FILE_DIALOG_PANEL_DEFAULT,
    dialogClassNames?.panel,
  )

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Close asChild>
            <button
              type="button"
              tabIndex={-1}
              className={backdropClasses}
              aria-hidden
            />
          </Dialog.Close>
          <Dialog.Content
            aria-describedby={undefined}
            className={contentClasses}
          >
            <div
              className={panelClasses}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                <div className="flex w-full shrink-0 justify-between gap-2 rounded-t-lg p-4 font-medium text-white">
                  <span className="flex items-center gap-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={t.viewFile.closeAriaLabel}
                        className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 disabled:pointer-events-none"
                      >
                        <X className="size-7" aria-hidden />
                      </button>
                    </Dialog.Close>
                    <Dialog.Title asChild>
                      <p>{name}</p>
                    </Dialog.Title>
                  </span>

                  {url && !isLoading && supportedForPreview ? (
                    <span className="flex gap-3">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0"
                        aria-label={t.viewFile.printAriaLabel}
                      >
                        <Printer className="size-6" aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => {
                          void handleDownload()
                        }}
                        className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50"
                        aria-busy={isDownloading}
                        aria-label={
                          isDownloading
                            ? t.viewFile.downloadInProgressAriaLabel
                            : t.viewFile.downloadAriaLabel
                        }
                      >
                        {isDownloading ? (
                          <LoaderCircle
                            className="size-6 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <Download className="size-6" aria-hidden />
                        )}
                      </button>
                    </span>
                  ) : null}
                </div>
                <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden text-white">
                  {!url || isLoading ? (
                    <LoaderCircle className="size-10 animate-spin" />
                  ) : isImage ? (
                    renderImage()
                  ) : isPdf ? (
                    renderPdf()
                  ) : (
                    renderUnsupported || (
                      <p>
                        {resolveFormattedMessage(
                          t.viewFile.unsupportedFileType,
                          { extension },
                        )}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Print-only (react-to-print). */}
      {isImage && url ? (
        <div className="hidden">
          <div ref={contentRef}>
            <img src={url} className="max-h-[105dvh]" alt={name} />
          </div>
        </div>
      ) : null}
    </>
  )
}
