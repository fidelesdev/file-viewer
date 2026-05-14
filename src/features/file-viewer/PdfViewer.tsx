import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import {
  ViewerFloatingToolbar,
  ViewerToolbarDivider,
  ViewerToolbarIconButton,
} from './components/ViewerToolbar'
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

  // Resize: debounced size used for <Page width=…> (canvas); instant size drives CSS scale while resizing
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
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        }
        setInstantSize(newSize)
        setRenderedSize((prev) =>
          prev.width === 0 && newSize.width > 0 ? newSize : prev,
        )
      }
    }

    const observer = new ResizeObserver(() => updateSize())
    if (containerRef.current) observer.observe(containerRef.current)
    updateSize()

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (instantSize.width === 0) return
    const timerId = window.setTimeout(() => {
      setRenderedSize(instantSize)
    }, debounceDelay)
    return () => window.clearTimeout(timerId)
  }, [instantSize, debounceDelay])

  // --- Dimension Calculation ---
  const calculateDimensions = useCallback(
    (container: { width: number; height: number }) => {
      if (!container.width || !container.height) {
        return {
          width: container.width ? container.width : undefined,
          height: container.height ? container.height : undefined,
        }
      }

      // Before the first page reports its size, use the viewport so <Page> can mount
      // and unlock aspect ratio (avoids height=undefined → nothing rendered).
      if (!pageOriginalSize.width || !pageOriginalSize.height) {
        return {
          width: container.width,
          height: container.height,
        }
      }

      const containerRatio = container.width / container.height
      const pageRatio = pageOriginalSize.width / pageOriginalSize.height

      if (viewMode === 'single') {
        if (pageRatio > containerRatio) {
          const width = container.width
          return { width, height: width / pageRatio }
        } else {
          const height = container.height
          return { height, width: height * pageRatio }
        }
      } else {
        // Continuous mode: width follows viewport up to 40rem, then scales height by page ratio
        let remToPx = 16
        if (typeof document !== 'undefined') {
          remToPx =
            parseFloat(getComputedStyle(document.documentElement).fontSize) ||
            16
        }

        const width = Math.min(container.width, remToPx * 40)
        return { width, height: width / pageRatio }
      }
    },
    [pageOriginalSize, viewMode],
  )

  const instantDimensions = useMemo(
    () => calculateDimensions(instantSize),
    [calculateDimensions, instantSize],
  )

  const renderedDimensions = useMemo(
    () => calculateDimensions(renderedSize),
    [calculateDimensions, renderedSize],
  )

  /** CSS scale from debounced canvas layout → current viewport (uniform, object-contain style). */
  const layoutScale = useMemo(() => {
    const renderedWidth = renderedDimensions.width
    const renderedHeight = renderedDimensions.height
    const instantWidth = instantDimensions.width
    const instantHeight = instantDimensions.height
    if (!renderedWidth || !instantWidth || !instantHeight) {
      return 1
    }
    if (!renderedHeight) {
      return instantWidth / renderedWidth
    }
    return Math.min(
      instantWidth / renderedWidth,
      instantHeight / renderedHeight,
    )
  }, [instantDimensions, renderedDimensions])

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
  // Stable ref to the current page so the observer effect doesn't reset on every page change
  // (which would lose the accumulated ratio map and cause flicker).
  const pageNumberRef = useRef(pageNumber)
  useEffect(() => {
    pageNumberRef.current = pageNumber
  }, [pageNumber])

  useEffect(() => {
    if (viewMode !== 'continuous' || !numPages || !containerRef.current) return

    // IntersectionObserver callbacks only contain entries whose threshold crossed in this tick,
    // not all observed targets. We track the latest ratio per page in a Map and always pick the
    // current global maximum to avoid flicker (e.g. 3 → 4 → 3 → 4 during a single scroll).
    const ratios = new Map<number, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pStr = entry.target.getAttribute('data-page-number')
          if (!pStr) continue
          const p = parseInt(pStr, 10)
          if (!Number.isFinite(p)) continue
          ratios.set(p, entry.intersectionRatio)
        }

        let bestPage = 0
        let bestRatio = 0
        ratios.forEach((ratio, page) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestPage = page
          }
        })

        if (bestPage > 0 && bestRatio > 0 && bestPage !== pageNumberRef.current) {
          setPage(bestPage)
        }
      },
      {
        root: containerRef.current,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    )

    const currentRefs = pageRefs.current
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [numPages, viewMode, setPage])

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
          <span className="px-1">{pageNumber}</span>
        )}
        <span className="opacity-60 mx-1">/</span>
        <span>{numPages}</span>
      </>
    )

    return (
      <ViewerFloatingToolbar className={paginationClassName || ''}>
        <FileViewerTooltip
          content={pdfT.previousPageTooltip}
          disabled={props.isFirstPage}
        >
          <ViewerToolbarIconButton
            disabled={props.isFirstPage}
            onClick={previousPage}
            aria-label={pdfT.previousPageAriaLabel}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>

        <ViewerToolbarDivider />

        {paginationBody}

        <ViewerToolbarDivider />

        <FileViewerTooltip
          content={pdfT.nextPageTooltip}
          disabled={props.isLastPage}
        >
          <ViewerToolbarIconButton
            disabled={props.isLastPage}
            onClick={nextPage}
            aria-label={pdfT.nextPageAriaLabel}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>
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
                ? 'flex min-h-full w-full flex-col items-center gap-4 py-4'
                : 'flex h-full min-h-full w-full items-center justify-center'
            }
          >
            <Document
              file={url}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={renderLoading}
              className={
                viewMode === 'continuous'
                  ? 'flex w-full flex-col items-center gap-4'
                  : 'flex h-full min-h-full w-full items-center justify-center'
              }
            >
              {viewMode === 'single' &&
              renderedDimensions.width &&
              instantDimensions.width &&
              instantDimensions.height ? (
                <div
                  className={`flex max-h-full max-w-full shrink-0 items-center justify-center overflow-hidden ${pageClassName}`}
                  style={{
                    width: instantDimensions.width,
                    height: instantDimensions.height,
                  }}
                >
                  <div
                    className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white shadow-lg"
                  >
                    <Page
                      pageNumber={pageNumber}
                      onLoadSuccess={(page) =>
                        handlePageLoadSuccess(pageNumber, page)
                      }
                      renderTextLayer={renderTextLayer}
                      renderAnnotationLayer={renderAnnotationLayer}
                      className="flex h-full w-full shrink flex-1 items-center justify-center !bg-transparent [&_canvas]:!h-full [&_canvas]:!w-full"
                      renderMode="canvas"
                      width={renderedDimensions.width}
                      loading={null}
                    />
                  </div>
                </div>
              ) : null}

              {viewMode === 'continuous' &&
                numPages > 0 &&
                renderedDimensions.width &&
                renderedDimensions.height &&
                instantDimensions.width &&
                Array.from(new Array(numPages), (_, index) => {
                  const p = index + 1

                  // Only mount the heavy <Page> component if it's within the sliding window
                  const isInWindow = Math.abs(p - pageNumber) <= preloadAhead

                  const renderedPageHeight =
                    renderedHeights.current.get(p) ??
                    renderedDimensions.height ??
                    0

                  const slotWidth = instantDimensions.width
                  const slotHeight = renderedPageHeight * layoutScale

                  const placeholderStyle =
                    !isInWindow && slotHeight
                      ? {
                          width: slotWidth,
                          height: slotHeight,
                          backgroundColor: '#80808040',
                        }
                      : {
                          width: slotWidth,
                          height: slotHeight,
                        }

                  return (
                    <div
                      key={`page_${p}`}
                      data-page-number={p}
                      ref={(el) => {
                        if (el) pageRefs.current.set(p, el)
                        else pageRefs.current.delete(p)
                      }}
                      style={placeholderStyle}
                      className={
                        isInWindow
                          ? `relative flex shrink-0 items-center justify-center overflow-hidden ${pageClassName}`
                          : 'relative flex shrink-0 items-center justify-center overflow-hidden'
                      }
                    >
                      {isInWindow ? (
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white shadow-lg">
                          <Page
                            pageNumber={p}
                            onLoadSuccess={(page) =>
                              handlePageLoadSuccess(p, page)
                            }
                            renderTextLayer={renderTextLayer}
                            renderAnnotationLayer={renderAnnotationLayer}
                            className="flex h-full w-full shrink flex-1 items-center justify-center !bg-transparent [&_canvas]:!h-full [&_canvas]:!w-full"
                            renderMode="canvas"
                            width={renderedDimensions.width}
                            loading={null}
                          />
                        </div>
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
