'use client'

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
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Document, Page } from 'react-pdf'
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
import type {
  PdfToolbarActionsContext,
  PdfToolbarActionsRenderProps,
  PdfViewerClassNames,
  PdfViewerStyles,
  ViewerExtraActionsSide,
} from './customization-types'
import {
  getFileViewerTranslations,
  resolveFormattedMessage,
  type ViewerLanguage,
} from './translations'
import { resolveOption } from './utils/resolve-options'
import { scrollElementWithinContainer } from './utils/scroll-element-within-container'
import { mergeClassNames } from './utils/merge-slot-props'
import { composeExtraActionsArea } from './utils/compose-extra-actions-area'

export type {
  PdfToolbarActionsContext,
  PdfToolbarActionsRenderProps,
  PdfViewerClassNames,
  PdfViewerStyles,
} from './customization-types'

const PDF_VIEWER_ROOT_DEFAULT = 'fv-pdf-viewer'

const PDF_SCROLL_AREA_DEFAULT = 'fv-pdf-scroll-area fv-scroll-area-root'

const PDF_SCROLL_VIEWPORT_DEFAULT = 'fv-pdf-scroll-viewport'

const PDF_SCROLLBAR_VERTICAL_DEFAULT = 'fv-scrollbar--vertical'

const PDF_SCROLLBAR_HORIZONTAL_DEFAULT = 'fv-scrollbar--horizontal'

const PDF_SCROLLBAR_THUMB_DEFAULT = 'fv-scrollbar-thumb'

const PDF_PAGE_DEFAULT = 'fv-pdf-page'

const PDF_PAGE_INNER_DEFAULT = 'fv-pdf-page-inner'

const CONTINUOUS_PAGE_GAP_PX = 16

/** Upper bound for the rendered page width, matching the `--fv-max-page-width` token. */
const MAX_PAGE_WIDTH_REM = 50

/** While programmatic nav runs, IO must not overwrite pageNumber (many pages visible at low zoom). */
const PROGRAMMATIC_NAV_SUPPRESS_MS = 900

/** rAF frames to re-apply scroll anchor while layout height changes during zoom. */
const ZOOM_SCROLL_SYNC_FRAMES = 45

const PDF_PAGE_INPUT_DEFAULT = 'fv-pagination-input'

const PDF_PAGE_CANVAS_DEFAULT = 'fv-pdf-page-canvas'

const PDF_PAGE_ZOOM_TRANSITION_CLASS = 'fv-pdf-page--zoom-transition'

const PDF_TOOLBAR_BUILTINS_DEFAULT = 'fv-toolbar-builtins'

const PDF_TOOLBAR_EXTRA_DEFAULT = 'fv-toolbar-extra'

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

  // Resize: container size is debounced — page slots and canvas update only after resize settles
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

  extraToolbarActions?:
    | ReactNode
    | ((context: PdfToolbarActionsContext) => ReactNode)
  extraToolbarActionsSide?: ViewerExtraActionsSide
  renderToolbarActions?: (props: PdfToolbarActionsRenderProps) => ReactNode

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
  const extraToolbarActions = resolved.extraToolbarActions
  const extraToolbarActionsSide = resolveOption(
    resolved.extraToolbarActionsSide,
    undefined,
    'right',
  )
  const renderToolbarActions = resolved.renderToolbarActions
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
  const [isPendingContainerResize, setIsPendingContainerResize] = useState(false)
  /** True on the render that applies a resize, so pages snap to the new size (no zoom transition)
   * and the restore scroll can measure the final heights instead of a mid-animation value. */
  const [isApplyingResize, setIsApplyingResize] = useState(false)
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

  const isPreservingScrollRef = useRef(false)
  const scrollAnchorSyncActiveRef = useRef(false)
  const userOverrodeScrollDuringZoomRef = useRef(false)
  const ignoreNextScrollEventRef = useRef(false)
  const lastProgrammaticScrollTopRef = useRef<number | null>(null)
  const lastAppliedScrollHeightRef = useRef(0)
  /** Viewport center as a fraction of scrollable content (zoom focal point). */
  const scrollAnchorRef = useRef({ ratioY: 0, ratioX: 0 })
  const zoomAnimFrameRef = useRef<number | null>(null)
  /**
   * Page the user was viewing when a container resize started. Restored once the
   * pages re-render at the new size, so a fixed px scroll offset does not land on
   * a different page after every page shrinks/grows.
   */
  const pageToRestoreOnResizeRef = useRef<number | null>(null)
  const resizeRestoreFrameRef = useRef<number | null>(null)
  const resizeRestoreTargetPageRef = useRef<number | null>(null)
  /** Mirrors `isApplyingResize` for async observers, so page tracking freezes during the settle. */
  const isApplyingResizeRef = useRef(false)

  /** Last render width the measured page heights correspond to (used to rescale on resize). */
  const lastRenderedWidthRef = useRef(0)
  /** Last container size applied via ResizeObserver (avoids no-op / mount churn). */
  const lastAppliedContainerSizeRef = useRef({ width: 0, height: 0 })
  /**
   * Until the document has a stable first layout, treat size changes as quiet updates —
   * no hide / restore settle (that flash on first PDF open).
   */
  const isReadyForResizeSettleRef = useRef(false)

  const centerHorizontalOverflow = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const overflow = container.scrollWidth - container.clientWidth
    container.scrollLeft = overflow > 0 ? overflow / 2 : 0
  }, [])

  /** Rendered page width for a given container width (clamped to the max page width). */
  const resolvePageRenderWidth = useCallback((containerWidth: number) => {
    if (!containerWidth) {
      return 0
    }

    let remToPx = 16
    if (typeof document !== 'undefined') {
      remToPx =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    }

    return Math.trunc(Math.min(containerWidth, remToPx * MAX_PAGE_WIDTH_REM))
  }, [])

  const setApplyingResize = useCallback((value: boolean) => {
    isApplyingResizeRef.current = value
    setIsApplyingResize(value)
  }, [])

  const cancelResizeRestoreLoop = useCallback(() => {
    if (resizeRestoreFrameRef.current !== null) {
      cancelAnimationFrame(resizeRestoreFrameRef.current)
      resizeRestoreFrameRef.current = null
    }
    resizeRestoreTargetPageRef.current = null
  }, [])

  const restorePageAfterResizeSettles = useCallback(
    (targetPage: number) => {
      cancelResizeRestoreLoop()
      resizeRestoreTargetPageRef.current = targetPage
      isApplyingResizeRef.current = true

      let lastScrollHeight = -1
      let stableFrames = 0
      let frameCount = 0
      const MAX_WAIT_FRAMES = 120
      const REQUIRED_STABLE_FRAMES = 4

      const step = () => {
        const container = containerRef.current
        const element = pageRefs.current.get(targetPage)
        if (!container || !element) {
          frameCount += 1
          if (frameCount >= MAX_WAIT_FRAMES) {
            pageToRestoreOnResizeRef.current = null
            setApplyingResize(false)
            cancelResizeRestoreLoop()
            return
          }
          resizeRestoreFrameRef.current = requestAnimationFrame(step)
          return
        }

        const currentScrollHeight = container.scrollHeight
        if (currentScrollHeight === lastScrollHeight) {
          stableFrames += 1
        } else {
          stableFrames = 0
          lastScrollHeight = currentScrollHeight
        }

        frameCount += 1
        if (
          stableFrames >= REQUIRED_STABLE_FRAMES ||
          frameCount >= MAX_WAIT_FRAMES
        ) {
          scrollElementWithinContainer(element, container, 'auto')
          pageToRestoreOnResizeRef.current = null
          centerHorizontalOverflow()
          setApplyingResize(false)
          cancelResizeRestoreLoop()
          return
        }

        resizeRestoreFrameRef.current = requestAnimationFrame(step)
      }

      resizeRestoreFrameRef.current = requestAnimationFrame(step)
    },
    [cancelResizeRestoreLoop, centerHorizontalOverflow, setApplyingResize],
  )

  const captureScrollAnchor = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const centerY = container.scrollTop + container.clientHeight / 2
    const centerX = container.scrollLeft + container.clientWidth / 2

    scrollAnchorRef.current = {
      ratioY:
        container.scrollHeight > 0 ? centerY / container.scrollHeight : 0,
      ratioX:
        container.scrollWidth > 0 ? centerX / container.scrollWidth : 0,
    }
  }, [])

  const applyScrollAnchor = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const newCenterY =
      container.scrollHeight * scrollAnchorRef.current.ratioY
    const newCenterX =
      container.scrollWidth * scrollAnchorRef.current.ratioX

    const nextTop = newCenterY - container.clientHeight / 2
    const nextLeft = newCenterX - container.clientWidth / 2

    if (Math.abs(container.scrollTop - nextTop) > 0.5) {
      container.scrollTop = nextTop
      lastProgrammaticScrollTopRef.current = nextTop
      ignoreNextScrollEventRef.current = true
    }
    if (Math.abs(container.scrollLeft - nextLeft) > 0.5) {
      container.scrollLeft = nextLeft
    }
  }, [])

  const cancelScrollAnchorSync = useCallback(() => {
    if (zoomAnimFrameRef.current !== null) {
      cancelAnimationFrame(zoomAnimFrameRef.current)
      zoomAnimFrameRef.current = null
    }
    scrollAnchorSyncActiveRef.current = false
    isPreservingScrollRef.current = false
    lastProgrammaticScrollTopRef.current = null
  }, [])

  const releaseScrollAnchorToUser = useCallback(() => {
    userOverrodeScrollDuringZoomRef.current = true
    cancelScrollAnchorSync()
  }, [cancelScrollAnchorSync])

  const runScrollAnchorSync = useCallback(() => {
    if (userOverrodeScrollDuringZoomRef.current) return

    const container = containerRef.current
    if (!container) return

    scrollAnchorSyncActiveRef.current = true
    isPreservingScrollRef.current = true
    lastAppliedScrollHeightRef.current = container.scrollHeight

    if (zoomAnimFrameRef.current !== null) {
      cancelAnimationFrame(zoomAnimFrameRef.current)
    }

    let frame = 0
    let stableFrames = 0

    const step = () => {
      if (userOverrodeScrollDuringZoomRef.current) {
        cancelScrollAnchorSync()
        return
      }

      const currentContainer = containerRef.current
      if (!currentContainer) {
        cancelScrollAnchorSync()
        return
      }

      const scrollHeight = currentContainer.scrollHeight
      if (scrollHeight !== lastAppliedScrollHeightRef.current) {
        applyScrollAnchor()
        lastAppliedScrollHeightRef.current = scrollHeight
        stableFrames = 0
      } else {
        stableFrames += 1
      }

      frame += 1
      if (
        stableFrames >= 3 ||
        frame >= ZOOM_SCROLL_SYNC_FRAMES
      ) {
        cancelScrollAnchorSync()
        return
      }

      zoomAnimFrameRef.current = requestAnimationFrame(step)
    }

    applyScrollAnchor()
    zoomAnimFrameRef.current = requestAnimationFrame(step)
  }, [applyScrollAnchor, cancelScrollAnchorSync])

  useEffect(() => {
    return () => {
      cancelScrollAnchorSync()
    }
  }, [cancelScrollAnchorSync])

  // Reset zoom and clear cached heights when URL or view mode changes
  useEffect(() => {
    setInstantZoom(1)
    setRenderedZoom(1)
    setHasZoomed(false)
    userOverrodeScrollDuringZoomRef.current = false
    cancelScrollAnchorSync()
    cancelResizeRestoreLoop()
    renderedHeights.current.clear()
    lastRenderedWidthRef.current = 0
    lastAppliedContainerSizeRef.current = { width: 0, height: 0 }
    isReadyForResizeSettleRef.current = false
    pageToRestoreOnResizeRef.current = null
    setApplyingResize(false)
  }, [
    url,
    viewMode,
    cancelScrollAnchorSync,
    cancelResizeRestoreLoop,
    setApplyingResize,
  ])

  /**
   * Arm the hide/restore settle path only after the first stable PDF layout.
   * Early ResizeObserver noise on first open must stay quiet (no flash).
   */
  useEffect(() => {
    if (
      isReadyForResizeSettleRef.current ||
      numPages <= 0 ||
      renderedSize.width <= 0 ||
      pageOriginalSize.width <= 0
    ) {
      return
    }

    const frameId = requestAnimationFrame(() => {
      isReadyForResizeSettleRef.current = true
    })
    return () => cancelAnimationFrame(frameId)
  }, [numPages, renderedSize.width, pageOriginalSize.width])

  useEffect(() => {
    if (instantZoom === renderedZoom) return
    const timerId = window.setTimeout(() => {
      const zoomRatio = instantZoom / renderedZoom
      if (renderedHeights.current.size > 0 && Number.isFinite(zoomRatio)) {
        for (const [page, height] of renderedHeights.current.entries()) {
          renderedHeights.current.set(page, Math.trunc(height * zoomRatio))
        }
      } else {
        renderedHeights.current.clear()
      }
      setRenderedZoom(instantZoom)
    }, zoomDebounceDelay)
    return () => window.clearTimeout(timerId)
  }, [instantZoom, renderedZoom, zoomDebounceDelay])

  // While the user navigates to a specific page via input/Enter/blur, freeze the displayed
  // input value at the target page so it doesn't tick through every page crossed during the scroll.
  const pendingInputPageRef = useRef<number | null>(null)
  const pendingInputPageTimerRef = useRef<number | null>(null)
  const suppressObserverPageSyncUntilRef = useRef(0)

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
    let debounceTimer: number | null = null
    let hasInitialSize = false

    const applySize = (
      newSize: { width: number; height: number },
      options?: { quiet?: boolean },
    ) => {
      const prevApplied = lastAppliedContainerSizeRef.current
      if (
        prevApplied.width === newSize.width &&
        prevApplied.height === newSize.height
      ) {
        return
      }
      lastAppliedContainerSizeRef.current = newSize

      // Measured heights were captured at the previous render width. Rescale them by the
      // width ratio (aspect ratio per page is preserved) so placeholder pages don't keep a
      // stale height — new width with old height would misplace the scroll after a resize.
      const newRenderWidth = resolvePageRenderWidth(newSize.width)
      const prevRenderWidth = lastRenderedWidthRef.current
      if (
        prevRenderWidth > 0 &&
        newRenderWidth > 0 &&
        prevRenderWidth !== newRenderWidth
      ) {
        const ratio = newRenderWidth / prevRenderWidth
        renderedHeights.current.forEach((height, page) => {
          renderedHeights.current.set(page, Math.round(height * ratio))
        })
      }
      lastRenderedWidthRef.current = newRenderWidth

      const shouldSettle =
        !options?.quiet &&
        isReadyForResizeSettleRef.current &&
        pageToRestoreOnResizeRef.current !== null

      if (shouldSettle) {
        setApplyingResize(true)
      }

      setInstantSize((prev) => {
        if (prev.width === newSize.width && prev.height === newSize.height) {
          return prev
        }
        return newSize
      })
      setRenderedSize((prev) => {
        if (prev.width === newSize.width && prev.height === newSize.height) {
          return prev
        }
        return newSize
      })
      setIsPendingContainerResize(false)
    }

    const scheduleSizeUpdate = () => {
      if (!containerRef.current) {
        return
      }

      const newSize = {
        width: Math.trunc(containerRef.current.clientWidth),
        height: Math.trunc(containerRef.current.clientHeight),
      }

      if (newSize.width <= 0) {
        return
      }

      if (!hasInitialSize) {
        hasInitialSize = true
        applySize(newSize, { quiet: true })
        return
      }

      if (!isReadyForResizeSettleRef.current) {
        // Still mounting / first layout — update dimensions quietly (no hide flash).
        applySize(newSize, { quiet: true })
        return
      }

      const newRenderWidth = resolvePageRenderWidth(newSize.width)
      if (newRenderWidth === lastRenderedWidthRef.current) {
        // Page width won't change, so pages don't need to resize or re-render.
        // We can apply the container size immediately and quietly without any flashes.
        if (debounceTimer !== null) {
          window.clearTimeout(debounceTimer)
          debounceTimer = null
        }
        pageToRestoreOnResizeRef.current = null
        cancelResizeRestoreLoop()
        setApplyingResize(false)
        applySize(newSize, { quiet: true })
        return
      }

      setIsPendingContainerResize(true)
      if (pageToRestoreOnResizeRef.current === null) {
        pageToRestoreOnResizeRef.current = pageNumberRef.current
      }
      requestAnimationFrame(() => {
        centerHorizontalOverflow()
      })

      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer)
      }

      debounceTimer = window.setTimeout(() => {
        debounceTimer = null
        applySize(newSize)
      }, debounceDelay)
    }

    const observer = new ResizeObserver(() => scheduleSizeUpdate())
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    scheduleSizeUpdate()

    return () => {
      observer.disconnect()
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer)
      }
    }
  }, [
    centerHorizontalOverflow,
    debounceDelay,
    resolvePageRenderWidth,
    setApplyingResize,
    cancelResizeRestoreLoop,
  ])

  useLayoutEffect(() => {
    if (isPendingContainerResize) {
      // Container changed but pages still hold the old size: keep horizontal overflow centered.
      centerHorizontalOverflow()
      return
    }

    // Pages just re-rendered at the new container size (transition suppressed, so heights are
    // final here). Keep the user on the same page, otherwise the unchanged px scroll offset
    // would map to a different page.
    const restorePage = pageToRestoreOnResizeRef.current
    if (restorePage !== null) {
      if (
        resizeRestoreTargetPageRef.current !== restorePage ||
        resizeRestoreFrameRef.current === null
      ) {
        restorePageAfterResizeSettles(restorePage)
      }
      return
    }

    centerHorizontalOverflow()
    setApplyingResize(false)
  }, [
    centerHorizontalOverflow,
    isPendingContainerResize,
    renderedSize,
    restorePageAfterResizeSettles,
    setApplyingResize,
  ])

  useEffect(() => {
    return () => {
      cancelResizeRestoreLoop()
    }
  }, [cancelResizeRestoreLoop])

  // --- Dimension Calculation ---
  const calculateDimensions = useCallback(
    (container: { width: number; height: number }) => {
      if (!container.width || !container.height) {
        return {
          width: container.width ? Math.trunc(container.width) : undefined,
          height: container.height ? Math.trunc(container.height) : undefined,
        }
      }

      const width = resolvePageRenderWidth(container.width)

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
    [pageOriginalSize, resolvePageRenderWidth],
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

  useLayoutEffect(() => {
    if (!hasZoomed || userOverrodeScrollDuringZoomRef.current) {
      return
    }
    // Re-apply the captured focal point after page slots resize, before paint —
    // avoids the scrollbar/content jump that shows up when syncing only in useEffect.
    runScrollAnchorSync()
  }, [
    hasZoomed,
    instantZoom,
    renderedZoom,
    layoutScale,
    zoomedInstantDimensions.width,
    zoomedInstantDimensions.height,
    runScrollAnchorSync,
  ])

  useEffect(() => {
    if (
      !hasZoomed ||
      userOverrodeScrollDuringZoomRef.current ||
      isLayoutSyncing
    ) {
      return
    }
    runScrollAnchorSync()
  }, [hasZoomed, isLayoutSyncing, runScrollAnchorSync])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasZoomed) return

    const isZoomLayoutInProgress =
      instantZoom !== renderedZoom || isLayoutSyncing

    const handleUserScrollIntent = () => {
      if (
        scrollAnchorSyncActiveRef.current ||
        isZoomLayoutInProgress
      ) {
        releaseScrollAnchorToUser()
      }
    }

    const handleScroll = () => {
      if (ignoreNextScrollEventRef.current) {
        ignoreNextScrollEventRef.current = false
        return
      }

      if (!scrollAnchorSyncActiveRef.current) return

      const expectedTop = lastProgrammaticScrollTopRef.current
      if (expectedTop === null) return

      if (Math.abs(container.scrollTop - expectedTop) > 3) {
        releaseScrollAnchorToUser()
      }
    }

    container.addEventListener('wheel', handleUserScrollIntent, {
      passive: true,
    })
    container.addEventListener('pointerdown', handleUserScrollIntent, {
      passive: true,
    })
    container.addEventListener('touchstart', handleUserScrollIntent, {
      passive: true,
    })
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('wheel', handleUserScrollIntent)
      container.removeEventListener('pointerdown', handleUserScrollIntent)
      container.removeEventListener('touchstart', handleUserScrollIntent)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [
    hasZoomed,
    instantZoom,
    renderedZoom,
    isLayoutSyncing,
    releaseScrollAnchorToUser,
  ])

  useEffect(() => {
    if (instantZoom === renderedZoom && !isLayoutSyncing) {
      userOverrodeScrollDuringZoomRef.current = false
    }
  }, [instantZoom, renderedZoom, isLayoutSyncing])

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

    if (
      isPreservingScrollRef.current &&
      !userOverrodeScrollDuringZoomRef.current
    ) {
      requestAnimationFrame(() => applyScrollAnchor())
    }
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

  const scrollToContinuousPage = useCallback(
    (targetPage: number, options?: { lockInputUntilArrived?: boolean }) => {
      const validPage = Math.max(1, Math.min(targetPage, numPages || 1))
      suppressObserverPageSyncUntilRef.current =
        performance.now() + PROGRAMMATIC_NAV_SUPPRESS_MS

      setPage(validPage)

      if (options?.lockInputUntilArrived) {
        pendingInputPageRef.current = validPage
        setInputPage(String(validPage))
        if (pendingInputPageTimerRef.current !== null) {
          window.clearTimeout(pendingInputPageTimerRef.current)
        }
        pendingInputPageTimerRef.current = window.setTimeout(() => {
          pendingInputPageRef.current = null
          pendingInputPageTimerRef.current = null
          setInputPage(String(pageNumberRef.current))
        }, PROGRAMMATIC_NAV_SUPPRESS_MS + 200)
      } else {
        setInputPage(String(validPage))
      }

      setVisibleRange((prev) => ({
        start: Math.max(1, Math.min(prev.start, validPage) - preloadAhead),
        end: Math.min(
          numPages || validPage,
          Math.max(prev.end, validPage) + preloadAhead,
        ),
      }))

      const scrollToPageElement = (attempt = 0) => {
        const element = pageRefs.current.get(validPage)
        const container = containerRef.current

        if (element && container) {
          scrollElementWithinContainer(element, container, 'smooth')
          return
        }

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth' as ScrollBehavior,
            block: 'start',
          })
          return
        }

        if (container && numPages > 0 && attempt >= 1) {
          const defaultPageHeight = zoomedRenderedDimensions.height ?? 0
          let offset = 0
          for (let page = 1; page < validPage; page++) {
            const renderedPageHeight =
              renderedHeights.current.get(page) ?? defaultPageHeight
            const slotHeight = Math.trunc(renderedPageHeight * layoutScale)
            offset += slotHeight + CONTINUOUS_PAGE_GAP_PX
          }
          container.scrollTo({ top: offset, behavior: 'smooth' })
          return
        }

        if (attempt < 40) {
          requestAnimationFrame(() => scrollToPageElement(attempt + 1))
        }
      }

      requestAnimationFrame(() => scrollToPageElement())
    },
    [
      numPages,
      preloadAhead,
      setPage,
      layoutScale,
      zoomedRenderedDimensions.height,
    ],
  )

  const previousPage = useCallback(() => {
    if (pendingInputPageRef.current !== null) return

    const p = Math.max(pageNumber - 1, 1)
    if (viewMode === 'continuous') {
      scrollToContinuousPage(p)
    } else {
      setPage(p)
    }
  }, [pageNumber, viewMode, setPage, scrollToContinuousPage])

  const nextPage = useCallback(() => {
    if (pendingInputPageRef.current !== null) return

    const p = Math.min(pageNumber + 1, numPages || 1)
    if (viewMode === 'continuous') {
      scrollToContinuousPage(p)
    } else {
      setPage(p)
    }
  }, [pageNumber, numPages, viewMode, setPage, scrollToContinuousPage])

  const goToPage = useCallback(
    (p: number) => {
      const validPage = Math.max(1, Math.min(p, numPages || 1))
      if (viewMode === 'continuous') {
        scrollToContinuousPage(validPage, { lockInputUntilArrived: true })
      } else {
        setPage(validPage)
      }
    },
    [numPages, viewMode, setPage, scrollToContinuousPage],
  )

  // --- Continuous Mode Observer ---
  // Stable ref to the current page so the observer effect doesn't reset on every page change
  // (which would lose the accumulated ratio map and cause flicker).
  const pageNumberRef = useRef(pageNumber)
  useEffect(() => {
    pageNumberRef.current = pageNumber
  }, [pageNumber])

  const updateVisiblePagesFromScroll = useCallback(() => {
    const container = containerRef.current
    if (
      !container ||
      viewMode !== 'continuous' ||
      numPages <= 0 ||
      isPreservingScrollRef.current ||
      isApplyingResizeRef.current
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
        // While a resize settles, the scroll offset is intentionally still on the old position
        // (content hidden). Skip page tracking so pagination and scrollbar don't jump then snap back.
        if (isApplyingResizeRef.current) {
          return
        }

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

        if (
          bestPage > 0 &&
          bestRatio > 0 &&
          bestPage !== pageNumberRef.current &&
          performance.now() >= suppressObserverPageSyncUntilRef.current
        ) {
          setPage(bestPage)
        }

        if (
          !isPreservingScrollRef.current &&
          minVisible !== Infinity &&
          maxVisible !== -Infinity
        ) {
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
  const handleZoomIn = useCallback(() => {
    setHasZoomed(true)
    userOverrodeScrollDuringZoomRef.current = false
    captureScrollAnchor()
    setInstantZoom((prev) => Math.min(prev * 1.3, 4))
  }, [captureScrollAnchor])

  const handleZoomOut = useCallback(() => {
    setHasZoomed(true)
    userOverrodeScrollDuringZoomRef.current = false
    captureScrollAnchor()
    setInstantZoom((prev) => Math.max(prev / 1.3, 0.5))
  }, [captureScrollAnchor])

  const handleZoomReset = useCallback(() => {
    setHasZoomed(true)
    userOverrodeScrollDuringZoomRef.current = false
    captureScrollAnchor()
    setInstantZoom(1)
  }, [captureScrollAnchor])

  const zoomOutDisabled = instantZoom <= 0.501
  const zoomInDisabled = instantZoom >= 3.99
  const fitDisabled = Math.abs(instantZoom - 1) < 0.01

  const paginationProps: PaginationRenderProps = {
    pageNumber,
    numPages,
    previousPage,
    nextPage,
    goToPage,
    isFirstPage: pageNumber <= 1,
    isLastPage: pageNumber >= numPages,
    viewMode,
  }

  const buildToolbarActionsContext = (): PdfToolbarActionsContext => ({
    pageNumber,
    numPages,
    viewMode,
    isFirstPage: paginationProps.isFirstPage,
    isLastPage: paginationProps.isLastPage,
    previousPage,
    nextPage,
    goToPage,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    zoomReset: handleZoomReset,
  })

  const buildZoomControls = (): ReactNode => (
    <>
      <FileViewerTooltip
        content={pdfT.zoomOutTooltip}
        disabled={zoomOutDisabled}
      >
        <ViewerToolbarIconButton
          disabled={zoomOutDisabled}
          onClick={handleZoomOut}
          aria-label={pdfT.zoomOutAriaLabel}
        >
          <ZoomOut className="fv-icon fv-icon--sm" />
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
          <Scan className="fv-icon fv-icon--sm" />
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
          <ZoomIn className="fv-icon fv-icon--sm" />
        </ViewerToolbarIconButton>
      </FileViewerTooltip>
    </>
  )

  const buildPaginationControls = (): ReactNode => {
    if (numPages <= 1) {
      return null
    }

    if (renderPagination) {
      return renderPagination(paginationProps)
    }

    const paginationBody = (
      <>
        <div className="fv-pagination-input-wrap">
          <input
            type="text"
            inputMode="numeric"
            value={inputPage}
            onChange={(event) => setInputPage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const parsedPage = parseInt(inputPage, 10)
                if (!Number.isNaN(parsedPage)) goToPage(parsedPage)
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                const parsedPage = parseInt(inputPage, 10)
                if (!Number.isNaN(parsedPage)) {
                  setInputPage(String(Math.min(parsedPage + 1, numPages)))
                }
              } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                const parsedPage = parseInt(inputPage, 10)
                if (!Number.isNaN(parsedPage)) {
                  setInputPage(String(Math.max(parsedPage - 1, 1)))
                }
              }
            }}
            onBlur={() => {
              const parsedPage = parseInt(inputPage, 10)
              if (!Number.isNaN(parsedPage)) goToPage(parsedPage)
              else setInputPage(String(pageNumber))
            }}
            className={pdfClassName('pageInput', PDF_PAGE_INPUT_DEFAULT)}
            style={pdfStyle('pageInput')}
            aria-label={resolveFormattedMessage(pdfT.pageInputAriaLabel, {
              value: inputPage,
            })}
          />
        </div>
        <span className="fv-pagination-separator">/</span>
        <span>{numPages}</span>
      </>
    )

    return (
      <>
        <FileViewerTooltip
          content={pdfT.previousPageTooltip}
          disabled={paginationProps.isFirstPage}
        >
          <ViewerToolbarIconButton
            disabled={paginationProps.isFirstPage}
            onClick={previousPage}
            aria-label={pdfT.previousPageAriaLabel}
          >
            <ChevronLeft className="fv-icon fv-icon--sm" aria-hidden />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>

        {paginationBody}

        <FileViewerTooltip
          content={pdfT.nextPageTooltip}
          disabled={paginationProps.isLastPage}
        >
          <ViewerToolbarIconButton
            disabled={paginationProps.isLastPage}
            onClick={nextPage}
            aria-label={pdfT.nextPageAriaLabel}
          >
            <ChevronRight className="fv-icon fv-icon--sm" aria-hidden />
          </ViewerToolbarIconButton>
        </FileViewerTooltip>

        <ViewerToolbarDivider />
      </>
    )
  }

  const buildDefaultToolbarActions = (): ReactNode => {
    const paginationControls = buildPaginationControls()

    return (
      <>
        {paginationControls}
        {buildZoomControls()}
      </>
    )
  }

  const renderExtraToolbarActions = (
    context: PdfToolbarActionsContext,
  ): ReactNode | null => {
    if (!extraToolbarActions) {
      return null
    }

    if (typeof extraToolbarActions === 'function') {
      return extraToolbarActions(context)
    }

    return extraToolbarActions
  }

  const renderToolbarActionsArea = (): ReactNode => {
    const context = buildToolbarActionsContext()
    const defaultActions = buildDefaultToolbarActions()

    if (renderToolbarActions) {
      return renderToolbarActions({ ...context, defaultActions })
    }

    return composeExtraActionsArea({
      side: extraToolbarActionsSide,
      builtins: defaultActions,
      extra: renderExtraToolbarActions(context),
      builtinsClassName: pdfClassName(
        'toolbarBuiltins',
        PDF_TOOLBAR_BUILTINS_DEFAULT,
      ),
      extraClassName: pdfClassName('toolbarExtra', PDF_TOOLBAR_EXTRA_DEFAULT),
      builtinsStyle: pdfStyle('toolbarBuiltins'),
      extraStyle: pdfStyle('toolbarExtra'),
    })
  }

  const renderToolbarElement = () => {
    if (renderPagination === null || numPages <= 0) return null

    return (
      <ViewerFloatingToolbar
        ref={toolbarRef}
        className={pdfClassName('pagination', 'fv-floating-toolbar')}
        style={pdfStyle('pagination')}
        data-toolbar-visible={isToolbarVisible}
      >
        {renderToolbarActionsArea()}
      </ViewerFloatingToolbar>
    )
  }

  const pageTransitionClass =
    hasZoomed && pageOriginalSize.width && !isApplyingResize
      ? PDF_PAGE_ZOOM_TRANSITION_CLASS
      : ''

  return (
    <FileViewerTooltipProvider>
      <div
        className={pdfClassName('root', PDF_VIEWER_ROOT_DEFAULT)}
        style={pdfStyle('root')}
        data-applying-resize={isApplyingResize ? 'true' : undefined}
      >
        <ScrollAreaRoot
          className={pdfClassName('scrollArea', PDF_SCROLL_AREA_DEFAULT)}
          style={pdfStyle('scrollArea')}
        >
        <ScrollAreaViewport
          ref={containerRef}
          className={pdfClassName('scrollViewport', PDF_SCROLL_VIEWPORT_DEFAULT)}
          style={pdfStyle('scrollViewport')}
          data-pending-resize={isPendingContainerResize ? 'true' : undefined}
        >
          <div className="fv-pdf-document-inner">
            <Document
              file={url}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={renderLoading}
              className="fv-pdf-document"
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
                      className={PDF_PAGE_CANVAS_DEFAULT}
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
                          backgroundColor: 'var(--fv-bg-page-placeholder)',
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
                            className={PDF_PAGE_CANVAS_DEFAULT}
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
        <ScrollAreaCorner className="fv-scroll-corner" />
      </ScrollAreaRoot>

      {renderToolbarElement()}
      </div>
    </FileViewerTooltipProvider>
  )
}
