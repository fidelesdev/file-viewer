import {
  ChevronLeft,
  ChevronRight,
  Scan,
  ZoomIn,
  ZoomOut,
} from './components/icons'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './primitives/scroll-area'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import './pdf-viewer.css'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import {
  ViewerFloatingToolbar,
  ViewerToolbarDivider,
  ViewerToolbarIconButton,
} from './components/ViewerToolbar'
import { useAutoHide } from './hooks/useAutoHide'
import { getFileViewerDefaults, resolvePdfViewerProps } from './config'
import type { PdfViewerClassNames, PdfViewerStyles } from './customization-types'
import {
  getFileViewerTranslations,
  resolveFormattedMessage,
  type ViewerLanguage,
} from './translations'
import { resolveOption } from './utils/resolve-options'
import { mergeClassNames } from './utils/merge-slot-props'

export type { PdfViewerClassNames, PdfViewerStyles } from './customization-types'

const PDF_VIEWER_ROOT_DEFAULT =
  'pdf-viewer flex flex-col items-center gap-4 w-full h-full max-h-full overflow-hidden relative'

const PDF_SCROLL_AREA_DEFAULT = 'size-full min-h-0 min-w-0'

const PDF_SCROLL_VIEWPORT_DEFAULT =
  'w-full h-full rounded-[inherit] [&>div]:min-h-full'

const PDF_SCROLLBAR_VERTICAL_DEFAULT =
  'flex flex-col touch-none select-none transition-colors w-4 border-l border-l-transparent p-0.5 hover:bg-black/10 z-20'

const PDF_SCROLLBAR_HORIZONTAL_DEFAULT =
  'flex flex-col touch-none select-none transition-colors h-4 border-t border-t-transparent p-0.5 hover:bg-black/10 z-20'

const PDF_SCROLLBAR_THUMB_DEFAULT =
  'relative shrink-0 rounded-full bg-neutral-500/50 hover:bg-neutral-500/80'

const PDF_PAGE_DEFAULT =
  'relative flex shrink-0 items-center justify-center overflow-hidden m-auto'

const PDF_PAGE_INNER_DEFAULT =
  'relative flex h-full w-full items-center justify-center overflow-hidden bg-white shadow-lg'

const PDF_PAGE_INPUT_DEFAULT =
  'w-10 bg-transparent text-center focus:outline-none transition-colors'

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
  viewMode?: PdfViewMode // default: 'continuous'

  // Resize: debounced size used for <Page width=…> (canvas); instant size drives CSS scale while resizing
  debounceDelay?: number // default: 300ms
  /** Debounce before re-rendering canvas at new resolution after zoom (default: 500ms). */
  zoomDebounceDelay?: number

  // Rendering
  renderTextLayer?: boolean // default: true
  renderAnnotationLayer?: boolean // default: true
  renderLoading?: ReactNode

  // Lazy loading (continuous mode)
  preloadAhead?: number // default: 1

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
  classNames?: PdfViewerClassNames
  styles?: PdfViewerStyles
}

export default function PdfViewer(props: PdfViewerProps) {
  const { url, language: languageProp, ...instanceProps } = props
  const resolved = resolvePdfViewerProps(instanceProps)

  const viewMode = resolved.viewMode ?? 'continuous'
  const debounceDelay = resolved.debounceDelay ?? 300
  const zoomDebounceDelay = resolved.zoomDebounceDelay ?? 500
  const renderTextLayer = resolved.renderTextLayer ?? true
  const renderAnnotationLayer = resolved.renderAnnotationLayer ?? true
  const renderLoading = resolved.renderLoading ?? null
  const preloadAhead = resolved.preloadAhead ?? 1
  const onLoadSuccess = resolved.onLoadSuccess
  const onLoadError = resolved.onLoadError
  const onPageChange = resolved.onPageChange
  const defaultPage = resolved.defaultPage ?? 1
  const renderPagination = resolved.renderPagination
  const paginationClassName = resolved.paginationClassName
  const className = resolved.className
  const pageClassName = resolved.pageClassName
  const classNames = resolved.classNames
  const styles = resolved.styles

  const language = resolveOption(
    languageProp,
    getFileViewerDefaults().language,
    'english',
  )

  const pdfT = getFileViewerTranslations(language).pdfViewer

  const autoHideDefaults = getFileViewerDefaults().autoHide

  const pdfClassName = (
    key: keyof PdfViewerClassNames,
    builtIn: string,
    extra?: string,
  ) =>
    mergeClassNames(
      builtIn,
      classNames?.[key],
      key === 'root' ? className : undefined,
      key === 'page' ? pageClassName : undefined,
      key === 'pagination' ? paginationClassName : undefined,
      extra,
    )

  const pdfStyle = (key: keyof PdfViewerStyles) => styles?.[key]

  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(defaultPage)
  const [visibleRange, setVisibleRange] = useState({ start: defaultPage, end: defaultPage })
  const [inputPage, setInputPage] = useState<string>(String(defaultPage))
  const containerRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const [instantSize, setInstantSize] = useState({ width: 0, height: 0 })
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 })
  const [pageOriginalSize, setPageOriginalSize] = useState({
    width: 0,
    height: 0,
  })

  const renderedHeights = useRef<Map<number, number>>(new Map())

  // --- Zoom State ---
  const [instantZoom, setInstantZoom] = useState(1)
  const [renderedZoom, setRenderedZoom] = useState(1)

  const isToolbarVisible = useAutoHide(toolbarRef, containerRef, {
    proximityThreshold: autoHideDefaults?.proximityThreshold,
    timeout: autoHideDefaults?.timeout,
    activityDeps: [pageNumber, instantZoom],
  })

  // Keep track of whether the user has interacted with zoom yet. 
  // If not, we don't apply CSS transitions to avoid initial layout jank from placeholders.
  const [hasZoomed, setHasZoomed] = useState(false)

  // Reset zoom and clear cached heights when URL or view mode changes
  useEffect(() => {
    setInstantZoom(1)
    setRenderedZoom(1)
    setHasZoomed(false)
    renderedHeights.current.clear()
  }, [url, viewMode])

  useEffect(() => {
    if (instantZoom === renderedZoom) return
    const timerId = window.setTimeout(() => {
      setRenderedZoom(instantZoom)
      renderedHeights.current.clear()
    }, zoomDebounceDelay)
    return () => window.clearTimeout(timerId)
  }, [instantZoom, renderedZoom, zoomDebounceDelay])

  // While the user navigates to a specific page via input/Enter/blur, freeze the displayed
  // input value at the target page so it doesn't tick through every page crossed during the scroll.
  const pendingInputPageRef = useRef<number | null>(null)
  const pendingInputPageTimerRef = useRef<number | null>(null)

  // Sync input with page number (skips while a programmatic navigation is in flight)
  useEffect(() => {
    const pending = pendingInputPageRef.current
    if (pending !== null) {
      if (pageNumber === pending) {
        pendingInputPageRef.current = null
        if (pendingInputPageTimerRef.current !== null) {
          window.clearTimeout(pendingInputPageTimerRef.current)
          pendingInputPageTimerRef.current = null
        }
        setInputPage(String(pageNumber))
      }
      return
    }
    setInputPage(String(pageNumber))
  }, [pageNumber])

  // --- Size Tracking ---
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newSize = {
          width: Math.trunc(containerRef.current.clientWidth),
          height: Math.trunc(containerRef.current.clientHeight),
        }
        setInstantSize((prev) => {
          if (prev.width === newSize.width && prev.height === newSize.height) return prev
          return newSize
        })
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
          width: container.width ? Math.trunc(container.width) : undefined,
          height: container.height ? Math.trunc(container.height) : undefined,
        }
      }

      let remToPx = 16
      if (typeof document !== 'undefined') {
        remToPx =
          parseFloat(getComputedStyle(document.documentElement).fontSize) ||
          16
      }

      const width = Math.trunc(Math.min(container.width, remToPx * 50))

      // Before the first page reports its size, use an approximation so <Page> can mount
      // and unlock aspect ratio (avoids height=undefined → nothing rendered).
      if (!pageOriginalSize.width || !pageOriginalSize.height) {
        return {
          width,
          height: Math.trunc(width * 1.414), // Approximate A4 ratio
        }
      }

      const pageRatio = pageOriginalSize.width / pageOriginalSize.height
      return { width, height: Math.trunc(width / pageRatio) }
    },
    [pageOriginalSize],
  )

  const instantDimensions = useMemo(
    () => calculateDimensions(instantSize),
    [calculateDimensions, instantSize],
  )

  const renderedDimensions = useMemo(
    () => calculateDimensions(renderedSize),
    [calculateDimensions, renderedSize],
  )

  const zoomedRenderedDimensions = useMemo(() => {
    return {
      width: renderedDimensions.width
        ? Math.trunc(renderedDimensions.width * renderedZoom)
        : undefined,
      height: renderedDimensions.height
        ? Math.trunc(renderedDimensions.height * renderedZoom)
        : undefined,
    }
  }, [renderedDimensions, renderedZoom])

  const zoomedInstantDimensions = useMemo(() => {
    return {
      width: instantDimensions.width
        ? Math.trunc(instantDimensions.width * instantZoom)
        : undefined,
      height: instantDimensions.height
        ? Math.trunc(instantDimensions.height * instantZoom)
        : undefined,
    }
  }, [instantDimensions, instantZoom])

  /** CSS scale from debounced canvas layout → current viewport (uniform, object-contain style). */
  const layoutScale = useMemo(() => {
    const renderedWidth = zoomedRenderedDimensions.width
    const renderedHeight = zoomedRenderedDimensions.height
    const instantWidth = zoomedInstantDimensions.width
    const instantHeight = zoomedInstantDimensions.height
    if (!renderedWidth || !instantWidth || !instantHeight) {
      return 1
    }
    if (!renderedHeight) {
      return Number((instantWidth / renderedWidth).toFixed(4))
    }
    return Number(
      Math.min(
        instantWidth / renderedWidth,
        instantHeight / renderedHeight,
      ).toFixed(4),
    )
  }, [zoomedInstantDimensions, zoomedRenderedDimensions])

  const isLayoutSyncing = useMemo(() => {
    if (instantZoom !== renderedZoom) return true
    if (
      instantSize.width !== renderedSize.width ||
      instantSize.height !== renderedSize.height
    ) {
      return true
    }
    return Math.abs(layoutScale - 1) > 0.001
  }, [
    instantZoom,
    renderedZoom,
    instantSize,
    renderedSize,
    layoutScale,
  ])

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
      setPageOriginalSize({
        width: Math.trunc(page.width),
        height: Math.trunc(page.height),
      })
    }

    // Store exact height for this specific page when it unmounts into a placeholder
    renderedHeights.current.set(pageIndex, Math.trunc(page.height))
  }

  // --- Page Navigation & Lazy Loading ---
  // Note: input sync is handled by the dedicated useEffect (which respects the navigation lock).
  const setPage = useCallback(
    (newPage: number) => {
      setPageNumber(newPage)
      onPageChange?.(newPage)
    },
    [onPageChange],
  )

  const previousPage = useCallback(() => {
    if (pendingInputPageRef.current !== null) return

    const p = Math.max(pageNumber - 1, 1)
    if (viewMode === 'continuous') {
      setTimeout(() => {
        pageRefs.current
          .get(p)
          ?.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'start' })
      }, 10)
    } else {
      setPage(p)
    }
  }, [pageNumber, viewMode, setPage])

  const nextPage = useCallback(() => {
    if (pendingInputPageRef.current !== null) return

    const p = Math.min(pageNumber + 1, numPages || 1)
    if (viewMode === 'continuous') {
      setTimeout(() => {
        pageRefs.current
          .get(p)
          ?.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'start' })
      }, 10)
    } else {
      setPage(p)
    }
  }, [pageNumber, numPages, viewMode, setPage])

  const goToPage = useCallback(
    (p: number) => {
      const validPage = Math.max(1, Math.min(p, numPages || 1))
      if (viewMode === 'continuous') {
        // Lock the input value at the target page while the scroll is in progress,
        // so the displayed number doesn't tick through intermediate pages.
        pendingInputPageRef.current = validPage
        setInputPage(String(validPage))
        if (pendingInputPageTimerRef.current !== null) {
          window.clearTimeout(pendingInputPageTimerRef.current)
        }
        // Safety fallback: if the user interrupts the scroll, release the lock after 750ms
        pendingInputPageTimerRef.current = window.setTimeout(() => {
          pendingInputPageRef.current = null
          pendingInputPageTimerRef.current = null
          setInputPage(String(pageNumberRef.current))
        }, 750)
        // Small timeout to allow React to render the placeholder/page before scrolling
        setTimeout(() => {
          pageRefs.current.get(validPage)?.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'start' })
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

  const CONTINUOUS_PAGE_GAP_PX = 16
  const isPreservingScrollRef = useRef(false)

  const updateVisiblePagesFromScroll = useCallback(() => {
    const container = containerRef.current
    if (
      !container ||
      viewMode !== 'continuous' ||
      numPages <= 0 ||
      isPreservingScrollRef.current
    ) {
      return
    }

    const scrollTop = container.scrollTop
    const viewBottom = scrollTop + container.clientHeight
    const defaultPageHeight = zoomedRenderedDimensions.height ?? 0

    let offset = 0
    let minVisible = Number.POSITIVE_INFINITY
    let maxVisible = 0

    for (let page = 1; page <= numPages; page++) {
      const renderedPageHeight =
        renderedHeights.current.get(page) ?? defaultPageHeight
      const slotHeight = Math.trunc(renderedPageHeight * layoutScale)
      const pageTop = offset
      const pageBottom = offset + slotHeight

      if (pageBottom > scrollTop && pageTop < viewBottom) {
        minVisible = Math.min(minVisible, page)
        maxVisible = Math.max(maxVisible, page)
      }

      offset = pageBottom + CONTINUOUS_PAGE_GAP_PX
    }

    if (minVisible === Number.POSITIVE_INFINITY) return

    setVisibleRange((prev) =>
      prev.start !== minVisible || prev.end !== maxVisible
        ? { start: minVisible, end: maxVisible }
        : prev,
    )
  }, [
    viewMode,
    numPages,
    layoutScale,
    zoomedRenderedDimensions.height,
  ])

  useEffect(() => {
    if (viewMode !== 'continuous' || !numPages || !containerRef.current) return

    const container = containerRef.current
    const handleScroll = () => {
      requestAnimationFrame(updateVisiblePagesFromScroll)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    updateVisiblePagesFromScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [numPages, viewMode, updateVisiblePagesFromScroll])

  useEffect(() => {
    if (instantZoom === renderedZoom) {
      updateVisiblePagesFromScroll()
    }
  }, [instantZoom, renderedZoom, updateVisiblePagesFromScroll])

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
        let minVisible = Infinity
        let maxVisible = -Infinity

        ratios.forEach((ratio, page) => {
          if (ratio > 0) {
            minVisible = Math.min(minVisible, page)
            maxVisible = Math.max(maxVisible, page)
          }

          if (ratio > bestRatio) {
            bestRatio = ratio
            bestPage = page
          }
        })

        if (bestPage > 0 && bestRatio > 0 && bestPage !== pageNumberRef.current) {
          setPage(bestPage)
        }

        if (minVisible !== Infinity && maxVisible !== -Infinity) {
          setVisibleRange((prev) => {
            if (prev.start !== minVisible || prev.end !== maxVisible) {
              return { start: minVisible, end: maxVisible }
            }
            return prev
          })
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

  // --- Zoom Actions ---
  const scrollRatioRef = useRef({ x: 0, y: 0 })
  const zoomAnimFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (zoomAnimFrameRef.current !== null) {
        cancelAnimationFrame(zoomAnimFrameRef.current)
      }
    }
  }, [])

  const preserveScrollPosition = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    isPreservingScrollRef.current = true

    // Calculate the center point of the current viewport relative to the total scrollable content
    const centerY = container.scrollTop + container.clientHeight / 2
    const ratioY = container.scrollHeight > 0 ? centerY / container.scrollHeight : 0

    const centerX = container.scrollLeft + container.clientWidth / 2
    const ratioX = container.scrollWidth > 0 ? centerX / container.scrollWidth : 0

    scrollRatioRef.current = { x: ratioX, y: ratioY }

    if (zoomAnimFrameRef.current !== null) {
      cancelAnimationFrame(zoomAnimFrameRef.current)
    }

    const startTime = performance.now()
    const duration = 250 // slightly longer than CSS transition (200ms) to ensure it catches the end

    const step = (time: number) => {
      const currentContainer = containerRef.current
      if (!currentContainer) return

      // Find the new center point based on the updated scrollHeight/Width
      const newCenterY = currentContainer.scrollHeight * scrollRatioRef.current.y
      const newCenterX = currentContainer.scrollWidth * scrollRatioRef.current.x

      // Adjust scrollTop/Left so that the new center point is in the middle of the viewport
      currentContainer.scrollTop = newCenterY - currentContainer.clientHeight / 2
      currentContainer.scrollLeft = newCenterX - currentContainer.clientWidth / 2

      if (time - startTime < duration) {
        zoomAnimFrameRef.current = requestAnimationFrame(step)
      } else {
        zoomAnimFrameRef.current = null
        isPreservingScrollRef.current = false
      }
    }

    zoomAnimFrameRef.current = requestAnimationFrame(step)
  }, [])

  const handleZoomIn = useCallback(() => {
    setHasZoomed(true)
    preserveScrollPosition()
    setInstantZoom((prev) => Math.min(prev * 1.3, 4))
  }, [preserveScrollPosition])

  const handleZoomOut = useCallback(() => {
    setHasZoomed(true)
    preserveScrollPosition()
    setInstantZoom((prev) => Math.max(prev / 1.3, 0.5))
  }, [preserveScrollPosition])

  const handleZoomReset = useCallback(() => {
    setHasZoomed(true)
    preserveScrollPosition()
    setInstantZoom(1)
  }, [preserveScrollPosition])

  const zoomOutDisabled = instantZoom <= 0.501
  const zoomInDisabled = instantZoom >= 3.99
  const fitDisabled = Math.abs(instantZoom - 1) < 0.01

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
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                const p = parseInt(inputPage, 10)
                if (!isNaN(p)) {
                  setInputPage(String(Math.min(p + 1, numPages)))
                }
              } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                const p = parseInt(inputPage, 10)
                if (!isNaN(p)) {
                  setInputPage(String(Math.max(p - 1, 1)))
                }
              }
            }}
            onBlur={() => {
              const p = parseInt(inputPage, 10)
              if (!isNaN(p)) goToPage(p)
              else setInputPage(String(pageNumber))
            }}
            className={pdfClassName('pageInput', PDF_PAGE_INPUT_DEFAULT)}
            style={pdfStyle('pageInput')}
            aria-label={resolveFormattedMessage(pdfT.pageInputAriaLabel, {
              value: inputPage,
            })}
          />
        </div>
        <span className="opacity-60 mx-1">/</span>
        <span>{numPages}</span>
      </>
    )

    return (
      <ViewerFloatingToolbar
        ref={toolbarRef}
        className={mergeClassNames(
          pdfClassName('pagination', ''),
          isToolbarVisible
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        style={pdfStyle('pagination')}
      >
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

        {paginationBody}

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

        <ViewerToolbarDivider />

        <FileViewerTooltip
          content={pdfT.zoomOutTooltip}
          disabled={zoomOutDisabled}
        >
          <ViewerToolbarIconButton
            disabled={zoomOutDisabled}
            onClick={handleZoomOut}
            aria-label={pdfT.zoomOutAriaLabel}
          >
            <ZoomOut className="h-5 w-5" />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>

        <FileViewerTooltip
          content={pdfT.fitWidthTooltip}
          disabled={fitDisabled}
        >
          <ViewerToolbarIconButton
            disabled={fitDisabled}
            onClick={handleZoomReset}
            aria-label={pdfT.fitWidthAriaLabel}
          >
            <Scan className="h-5 w-5" />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>

        <FileViewerTooltip
          content={pdfT.zoomInTooltip}
          disabled={zoomInDisabled}
        >
          <ViewerToolbarIconButton
            disabled={zoomInDisabled}
            onClick={handleZoomIn}
            aria-label={pdfT.zoomInAriaLabel}
          >
            <ZoomIn className="h-5 w-5" />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>
      </ViewerFloatingToolbar>
    )
  }

  const pageTransitionClass =
    hasZoomed && pageOriginalSize.width
      ? 'transition-[width,height] duration-200 ease-out'
      : ''

  return (
    <FileViewerTooltipProvider>
      <div
        className={pdfClassName('root', PDF_VIEWER_ROOT_DEFAULT)}
        style={pdfStyle('root')}
      >
        <ScrollAreaRoot
          className={pdfClassName('scrollArea', PDF_SCROLL_AREA_DEFAULT)}
          style={pdfStyle('scrollArea')}
        >
        <ScrollAreaViewport
          ref={containerRef}
          className={pdfClassName(
            'scrollViewport',
            `${PDF_SCROLL_VIEWPORT_DEFAULT} pdf-scroll-viewport`,
          )}
          style={pdfStyle('scrollViewport')}
        >
          <div className="flex min-h-full min-w-full flex-col">
            <Document
              file={url}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={renderLoading}
              className="flex w-full flex-col gap-4"
            >
              {viewMode === 'single' &&
              zoomedRenderedDimensions.width &&
              zoomedInstantDimensions.width &&
              zoomedInstantDimensions.height ? (
                <div
                  data-layout-syncing={isLayoutSyncing ? 'true' : undefined}
                  className={pdfClassName(
                    'page',
                    PDF_PAGE_DEFAULT,
                    pageTransitionClass,
                  )}
                  style={{
                    width: zoomedInstantDimensions.width,
                    height: zoomedInstantDimensions.height,
                    ...pdfStyle('page'),
                  }}
                >
                  <div
                    className={pdfClassName('pageInner', PDF_PAGE_INNER_DEFAULT)}
                    style={pdfStyle('pageInner')}
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
                      width={zoomedRenderedDimensions.width}
                      loading={null}
                    />
                  </div>
                </div>
              ) : null}

              {viewMode === 'continuous' &&
                numPages > 0 &&
                zoomedRenderedDimensions.width &&
                zoomedRenderedDimensions.height &&
                zoomedInstantDimensions.width &&
                Array.from(new Array(numPages), (_, index) => {
                  const p = index + 1

                  // Mount the heavy <Page> component if it's visible, plus the buffer ahead/behind
                  const isInWindow =
                    p >= visibleRange.start - preloadAhead &&
                    p <= visibleRange.end + preloadAhead

                  const renderedPageHeight =
                    renderedHeights.current.get(p) ??
                    zoomedRenderedDimensions.height ??
                    0

                  const slotWidth = zoomedInstantDimensions.width
                    ? Math.trunc(zoomedInstantDimensions.width)
                    : undefined
                  const slotHeight = Math.trunc(renderedPageHeight * layoutScale)

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
                      data-layout-syncing={isLayoutSyncing ? 'true' : undefined}
                      data-page-number={p}
                      ref={(el) => {
                        if (el) pageRefs.current.set(p, el)
                        else pageRefs.current.delete(p)
                      }}
                      className={pdfClassName(
                        'page',
                        PDF_PAGE_DEFAULT,
                        pageTransitionClass,
                      )}
                      style={{ ...placeholderStyle, ...pdfStyle('page') }}
                    >
                      {isInWindow ? (
                        <div
                          className={pdfClassName(
                            'pageInner',
                            PDF_PAGE_INNER_DEFAULT,
                          )}
                          style={pdfStyle('pageInner')}
                        >
                          <Page
                            pageNumber={p}
                            onLoadSuccess={(page) =>
                              handlePageLoadSuccess(p, page)
                            }
                            renderTextLayer={renderTextLayer}
                            renderAnnotationLayer={renderAnnotationLayer}
                            className="flex h-full w-full shrink flex-1 items-center justify-center !bg-transparent [&_canvas]:!h-full [&_canvas]:!w-full"
                            renderMode="canvas"
                            width={zoomedRenderedDimensions.width}
                            loading={null}
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
            </Document>
          </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar
          orientation="vertical"
          className={pdfClassName('scrollbar', PDF_SCROLLBAR_VERTICAL_DEFAULT)}
          style={pdfStyle('scrollbar')}
        >
          <ScrollAreaThumb
            className={pdfClassName('scrollbarThumb', PDF_SCROLLBAR_THUMB_DEFAULT)}
            style={pdfStyle('scrollbarThumb')}
          />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollbar
          orientation="horizontal"
          className={pdfClassName(
            'scrollbar',
            PDF_SCROLLBAR_HORIZONTAL_DEFAULT,
          )}
          style={pdfStyle('scrollbar')}
        >
          <ScrollAreaThumb
            className={pdfClassName('scrollbarThumb', PDF_SCROLLBAR_THUMB_DEFAULT)}
            style={pdfStyle('scrollbarThumb')}
          />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner className="bg-transparent" />
      </ScrollAreaRoot>

      {renderPaginationElement()}
      </div>
    </FileViewerTooltipProvider>
  )
}
