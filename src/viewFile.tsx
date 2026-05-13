import * as Dialog from '@radix-ui/react-dialog'
import { Download, LoaderCircle, Printer, X } from 'lucide-react'
import { ReactNode, Suspense, useEffect, useRef, useState, lazy } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { PdfViewerProps } from './pdfViewer'

const LazyPdfViewer = lazy(() => import('./pdfViewer'))

export interface ViewFileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  extension: string
  url?: string
  isLoading?: boolean
  onDownload?: () => void
  pdfViewerProps?: Omit<PdfViewerProps, 'url'>
  renderUnsupported?: ReactNode
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
}: ViewFileProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const printImage = useReactToPrint({ contentRef })

  const ext = extension.toLowerCase()
  const isPdf = ext === 'pdf'
  const isImage = ['jpg', 'png', 'jpeg'].includes(ext)

  // Guard for client-side rendering when using React.lazy directly
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderPdf = () => {
    if (!isMounted) return null

    return (
      <Suspense
        fallback={<LoaderCircle className="animate-spin size-10 text-white" />}
      >
        <LazyPdfViewer url={url!} {...pdfViewerProps} />
      </Suspense>
    )
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-none translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-neutral-800/70 p-0 shadow-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] size-full flex flex-col focus:outline-none">
            <div className="flex flex-col gap-2 justify-center items-center flex-1 overflow-hidden">
              <div className="flex justify-between gap-2 w-full text-white font-medium p-4 rounded-t-lg">
                <span className="flex items-center gap-2">
                  <Dialog.Close
                    className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    asChild
                  >
                    <X className="size-7" />
                  </Dialog.Close>
                  <p>{name}</p>
                </span>

                {url && !isLoading && (
                  <span className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPdf) {
                          const printWindow = window.open(url, '_blank')
                          printWindow?.print()
                        } else {
                          printImage()
                        }
                      }}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Printer />
                    </button>
                    {onDownload && (
                      <button
                        type="button"
                        onClick={onDownload}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <Download />
                      </button>
                    )}
                  </span>
                )}
              </div>
              <div className="flex w-full justify-center items-center text-white flex-1 overflow-hidden">
                {!url || isLoading ? (
                  <LoaderCircle className="animate-spin size-10 " />
                ) : isImage ? (
                  <img
                    src={url}
                    className="max-h-[calc(100vh-10rem)] max-w-full shadow"
                    alt={name}
                  />
                ) : isPdf ? (
                  renderPdf()
                ) : (
                  renderUnsupported || (
                    <p>
                      Ainda não existem vizualizações para arquivos do tipo
                      &quot;
                      {extension}&quot;
                    </p>
                  )
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {isImage && url && (
        <div className="hidden">
          <div ref={contentRef}>
            <img src={url} className="max-h-[105vh]" alt={name} />
          </div>
        </div>
      )}
    </>
  )
}
