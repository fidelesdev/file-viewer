import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ViewerFloatingToolbar,
  ViewerToolbarIconButton,
} from './components/ViewerToolbar'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import {
  getFileViewerTranslations,
  resolveFormattedMessage,
  type ViewerLanguage,
} from './translations'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export type PdfViewMode = 'single' | 'continuous'

export interface PaginationRenderProps {
  pageNumber: number
  numPages: number
  previousPage: () => void
  nextPage: () => void
  goToPage: (page: number) => void
  isFirstPage: boolean
  isLastPage: boolean
  viewMode: PdfViewMode
}

export interface PdfViewerProps {
  url: string

  // View mode
  viewMode?: PdfViewMode // default: 'single'

  // Resize
  debounceDelay?: number // default: 300ms

  // Rendering
  renderTextLayer?: boolean // default: true
  renderAnnotationLayer?: boolean // default: true
  renderLoading?: ReactNode

  // Lazy loading (continuous mode)
  preloadAhead?: number // default: 5

  // Callbacks
  onLoadSuccess?: (numPages: number) => void
  onLoadError?: (error: Error) => void
  onPageChange?: (page: number) => void

  // Pagination
  defaultPage?: number
  renderPagination?: ((props: PaginationRenderProps) => ReactNode) | null

  paginationClassName?: string

  language?: ViewerLanguage

  // Styling
  className?: string
  pageClassName?: string
}

export default function PdfViewer({
  url,
  viewMode = 'single',
  debounceDelay = 300,
  renderTextLayer = true,
  renderAnnotationLayer = true,
  renderLoading = null,
  preloadAhead = 5,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  defaultPage = 1,
  renderPagination,
  paginationClassName,
  language = 'english',
  className = '',
  pageClassName = '',
}: PdfViewerProps) {
  const pdfT = getFileViewerTranslations(language).pdfViewer

  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(defaultPage)
  const [inputPage, setInputPage] = useState<string>(String(defaultPage))
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const [instantSize, setInstantSize] = useState({ width: 0, height: 0 })
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 })
  const [pageOriginalSize, setPageOriginalSize] = useState({
    width: 0,
    height: 0,
  })

  const renderedHeights = useRef<Map<number, number>>(new Map())

  // Sync input with page number
  useEffect(() => {
    setInputPage(String(pageNumber))
  }, [pageNumber])

  // --- Size Tracking ---
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newSize = {
          width: Number(containerRef.current.clientWidth.toFixed(2)),
          height: Number(containerRef.current.clientHeight.toFixed(2)),
        }
        setInstantSize((prev) => {
          if (prev.width === newSize.width && prev.height === newSize.height) return prev
          return newSize
        })
        setRenderedSize((prev) => (prev.width === 0 ? newSize : prev))
      }
    }

    const observer = new ResizeObserver(() => updateSize())
    if (containerRef.current) observer.observe(containerRef.current)
    updateSize()

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (instantSize.width === 0) return
    const timer = setTimeout(() => {
      setRenderedSize(instantSize)
    }, debounceDelay)
    return () => clearTimeout(timer)
  }, [instantSize, debounceDelay])

  // --- Dimension Calculation ---
  const calculateDimensions = useCallback(
    (container: { width: number; height: number }) => {
      if (
        !container.width ||
        !container.height ||
        !pageOriginalSize.width ||
        !pageOriginalSize.height
      ) {
        return {
          width: container.width ? Number(container.width.toFixed(2)) : undefined,
          height: undefined,
        }
      }

      const containerRatio = container.width / container.height
      const pageRatio = pageOriginalSize.width / pageOriginalSize.height

      if (viewMode === 'single') {
        if (pageRatio > containerRatio) {
          const width = container.width
          return {
            width: Number(width.toFixed(2)),
            height: Number((width / pageRatio).toFixed(2)),
          }
        } else {
          const height = container.height
          return {
            height: Number(height.toFixed(2)),
            width: Number((height * pageRatio).toFixed(2)),
          }
        }
      } else {
        // Continuous mode: limit width to min(container.width, 50rem)
        // This dramatically reduces RAM usage for high DPI PDFs on ultra-wide screens
        let remToPx = 16
        if (typeof document !== 'undefined') {
          remToPx =
            parseFloat(getComputedStyle(document.documentElement).fontSize) ||
            16
        }

        const width = Math.min(container.width, remToPx * 50)
        return {
          width: Number(width.toFixed(2)),
          height: Number((width / pageRatio).toFixed(2)),
        }
      }
    },
    [pageOriginalSize.width, pageOriginalSize.height, viewMode],
  )

  const instantDimensions = useMemo(
    () => calculateDimensions(instantSize),
    [calculateDimensions, instantSize],
  )
  const renderedDimensions = useMemo(
    () => calculateDimensions(renderedSize),
    [calculateDimensions, renderedSize.width, renderedSize.height],
  )

  const scale = useMemo(() => {
    if (viewMode === 'continuous') return 1 // No scaling in continuous mode to avoid height glitches
    if (!instantDimensions.width || !renderedDimensions.width) return 1
    return instantDimensions.width / renderedDimensions.width
  }, [instantDimensions.width, renderedDimensions.width, viewMode])

  // --- PDF Callbacks ---
  const handleDocumentLoadSuccess = ({
    numPages: loadedNumPages,
  }: {
    numPages: number
  }) => {
    setNumPages(loadedNumPages)
    onLoadSuccess?.(loadedNumPages)
  }

  const handleDocumentLoadError = (error: Error) => {
    console.error(error)
    onLoadError?.(error)
  }

  const handlePageLoadSuccess = (
    pageIndex: number,
    page: { width: number; height: number },
  ) => {
    // Only use the first page's natural aspect ratio for global dimension scaling placeholders
    if (pageIndex === 1) {
      setPageOriginalSize({ width: page.width, height: page.height })
    }

    // Store exact height for this specific page when it unmounts into a placeholder
    renderedHeights.current.set(pageIndex, page.height)
  }

  // --- Page Navigation & Lazy Loading ---
  const setPage = useCallback(
    (newPage: number) => {
      setPageNumber(newPage)
      setInputPage(String(newPage))
      onPageChange?.(newPage)
    },
    [onPageChange],
  )

  const previousPage = useCallback(() => {
    const p = Math.max(pageNumber - 1, 1)
    if (viewMode === 'continuous') {
      setPage(p)
      setTimeout(() => {
        pageRefs.current
          .get(p)
          ?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
      }, 10)
    } else {
      setPage(p)
    }
  }, [pageNumber, viewMode, setPage])

  const nextPage = useCallback(() => {
    const p = Math.min(pageNumber + 1, numPages || 1)
    if (viewMode === 'continuous') {
      setPage(p)
      setTimeout(() => {
        pageRefs.current
          .get(p)
          ?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
      }, 10)
    } else {
      setPage(p)
    }
  }, [pageNumber, numPages, viewMode, setPage])

  const goToPage = useCallback(
    (p: number) => {
      const validPage = Math.max(1, Math.min(p, numPages || 1))
      if (viewMode === 'continuous') {
        setPage(validPage)
        // Small timeout to allow React to render the placeholder/page before scrolling
        setTimeout(() => {
          pageRefs.current.get(validPage)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
        }, 10)
      } else {
        setPage(validPage)
      }
    },
    [numPages, viewMode, setPage],
  )

  // --- Continuous Mode Observer ---
  useEffect(() => {
    if (viewMode !== 'continuous' || !numPages || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Find the entry with the highest intersection ratio
          const maxVisible = visibleEntries.reduce((prev, current) =>
            prev.intersectionRatio > current.intersectionRatio ? prev : current,
          )
          const pStr = maxVisible.target.getAttribute('data-page-number')
          if (pStr) {
            const p = parseInt(pStr, 10)
            if (p !== pageNumber) {
              setPage(p)
            }
          }
        }
      },
      {
        root: containerRef.current,
        threshold: [0.1, 0.5, 0.9],
      },
    )

    const currentRefs = pageRefs.current
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [numPages, viewMode, pageNumber, setPage])

  // --- Render Pagination ---
  const renderPaginationElement = () => {
    if (renderPagination === null || numPages <= 1) return null

    const props: PaginationRenderProps = {
      pageNumber,
      numPages,
      previousPage,
      nextPage,
      goToPage,
      isFirstPage: pageNumber <= 1,
      isLastPage: pageNumber >= numPages,
      viewMode,
    }

    if (renderPagination) {
      return renderPagination(props)
    }

    // Default pagination
    const paginationBody = (
      <>
        <span>{pdfT.pageLabel}</span>
        {viewMode === 'single' ? (
          <div className="bg-black/20 rounded px-1 flex items-center justify-center">
            <input
              type="text"
              inputMode="numeric"
              value={inputPage}
              onChange={(event) => setInputPage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const p = parseInt(inputPage, 10)
                  if (!isNaN(p)) goToPage(p)
                }
              }}
              onBlur={() => {
                const p = parseInt(inputPage, 10)
                if (!isNaN(p)) goToPage(p)
                else setInputPage(String(pageNumber))
              }}
              className="w-10 bg-transparent text-center focus:outline-none transition-colors"
              aria-label={resolveFormattedMessage(pdfT.pageInputAriaLabel, {
                value: inputPage,
              })}
            />
          </div>
        ) : (
          <span>{pageNumber}</span>
        )}
        <span className="opacity-60 mx-1">/</span>
        <span>{numPages}</span>
      </>
    )

    return (
      <ViewerFloatingToolbar
        density={viewMode === 'continuous' ? 'comfortable' : 'compact'}
        className={paginationClassName || ''}
      >
        {viewMode === 'single' && (
          <FileViewerTooltip
            content={pdfT.previousPageAriaLabel || 'Página anterior'}
            disabled={props.isFirstPage}
          >
            <ViewerToolbarIconButton
              disabled={props.isFirstPage}
              onClick={previousPage}
              aria-label={pdfT.previousPageAriaLabel || 'Página anterior'}
            >
              <ChevronLeft className="w-5 h-5" />
            </ViewerToolbarIconButton>
          </FileViewerTooltip>
        )}

        {paginationBody}

        {viewMode === 'single' && (
          <FileViewerTooltip
            content={pdfT.nextPageAriaLabel || 'Próxima página'}
            disabled={props.isLastPage}
          >
            <ViewerToolbarIconButton
              disabled={props.isLastPage}
              onClick={nextPage}
              aria-label={pdfT.nextPageAriaLabel || 'Próxima página'}
            >
              <ChevronRight className="w-5 h-5" />
            </ViewerToolbarIconButton>
          </FileViewerTooltip>
        )}
      </ViewerFloatingToolbar>
    )
  }

  return (
    <FileViewerTooltipProvider>
      <div
        className={`flex flex-col items-center gap-4 w-full h-full max-h-full overflow-hidden relative ${className}`}
      >
      <ScrollAreaPrimitive.Root className="flex w-full flex-1 relative overflow-hidden">
        <ScrollAreaPrimitive.Viewport
          ref={containerRef}
          className="w-full h-full rounded-[inherit] [&>div]:min-h-full"
        >
          <div
            className={
              viewMode === 'continuous'
                ? 'flex flex-col items-center gap-4 py-4 w-full'
                : 'flex justify-center items-center w-full'
            }
          >
            <Document
              file={url}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={renderLoading}
              className={
                viewMode === 'continuous'
                  ? 'flex flex-col items-center gap-4 w-full'
                  : 'flex justify-center items-center'
              }
            >
              {viewMode === 'single' && (
                <div
                  style={{
                    width: renderedDimensions.width,
                    height: renderedDimensions.height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                  className={`relative shadow-lg bg-white overflow-hidden flex justify-center items-center will-change-transform shrink-0 ${pageClassName}`}
                >
                  <Page
                    pageNumber={pageNumber}
                    onLoadSuccess={(page) =>
                      handlePageLoadSuccess(pageNumber, page)
                    }
                    renderTextLayer={renderTextLayer}
                    renderAnnotationLayer={renderAnnotationLayer}
                    className="flex justify-center items-center !bg-transparent"
                    renderMode="canvas"
                    width={renderedDimensions.width}
                    height={renderedDimensions.height}
                    loading={null}
                  />
                </div>
              )}

              {viewMode === 'continuous' &&
                numPages > 0 &&
                Array.from(new Array(numPages), (_, index) => {
                  const p = index + 1

                  // Only mount the heavy <Page> component if it's within the sliding window
                  const isInWindow = Math.abs(p - pageNumber) <= preloadAhead

                  // If it's outside the window, use its last known exact height,
                  // or fall back to the estimated height based on the first page ratio
                  const knownHeight = renderedHeights.current.get(p)
                  const placeholderHeight = knownHeight ?? renderedDimensions.height

                  const placeholderStyle =
                    !isInWindow && placeholderHeight
                      ? {
                          width: renderedDimensions.width,
                          height: placeholderHeight,
                          backgroundColor: '#80808040',
                        }
                      : undefined

                  return (
                    <div
                      key={`page_${p}`}
                      data-page-number={p}
                      ref={(el) => {
                        if (el) pageRefs.current.set(p, el)
                        else pageRefs.current.delete(p)
                      }}
                      style={placeholderStyle}
                      className={`relative shadow-lg bg-white overflow-hidden flex justify-center items-center shrink-0 ${pageClassName}`}
                    >
                      {isInWindow ? (
                        <Page
                          pageNumber={p}
                          onLoadSuccess={(page) => handlePageLoadSuccess(p, page)}
                          renderTextLayer={renderTextLayer}
                          renderAnnotationLayer={renderAnnotationLayer}
                          className="flex justify-center items-center !bg-transparent"
                          renderMode="canvas"
                          width={renderedDimensions.width}
                          loading={null}
                        />
                      ) : null}
                    </div>
                  )
                })}
            </Document>
          </div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className="flex touch-none select-none transition-colors w-2.5 border-l border-l-transparent p-[1px] hover:bg-black/10 z-20"
        >
          <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-white/30 hover:bg-white/50" />
        </ScrollAreaPrimitive.Scrollbar>
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="flex flex-col touch-none select-none transition-colors h-2.5 border-t border-t-transparent p-[1px] hover:bg-black/10 z-20"
        >
          <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-white/30 hover:bg-white/50" />
        </ScrollAreaPrimitive.Scrollbar>
        <ScrollAreaPrimitive.Corner className="bg-transparent" />
      </ScrollAreaPrimitive.Root>

      {renderPaginationElement()}
      </div>
    </FileViewerTooltipProvider>
  )
}
