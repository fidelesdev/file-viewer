import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { renderAsChild } from './as-child'
import {
  computeTooltipPlacement,
  type TooltipPlacement,
  type TooltipSide,
} from './compute-tooltip-placement'

type TooltipGroupContextValue = {
  delayDuration: number
  skipDelayDuration: number
  closeDelayDuration: number
  getOpenDelay: () => number
  onTooltipOpened: () => void
  closeActiveTooltip: () => void
  requestExclusiveOpen: (closeCallback: () => void) => void
  releaseExclusiveOpen: (closeCallback: () => void) => void
}

const TooltipGroupContext = createContext<TooltipGroupContextValue | null>(null)

function useTooltipGroup() {
  const context = useContext(TooltipGroupContext)
  if (!context) {
    throw new Error('Tooltip components must be used within TooltipProvider')
  }
  return context
}

/** Closes the currently open tooltip in this provider (no-op if none). */
export function useCloseActiveTooltip(): () => void {
  const context = useContext(TooltipGroupContext)
  return context?.closeActiveTooltip ?? (() => undefined)
}

const DEFAULT_CLOSE_DELAY_MS = 0

export function TooltipProvider({
  children,
  delayDuration = 300,
  skipDelayDuration = 500,
  closeDelayDuration = DEFAULT_CLOSE_DELAY_MS,
}: {
  children: ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  /** Delay before hiding after pointer leaves (default: 0). */
  closeDelayDuration?: number
}) {
  const isOpenDelayedRef = useRef(true)
  const skipDelayTimerRef = useRef<number | null>(null)
  const activeCloseRef = useRef<(() => void) | null>(null)

  const onTooltipOpened = useCallback(() => {
    if (skipDelayTimerRef.current !== null) {
      window.clearTimeout(skipDelayTimerRef.current)
    }

    isOpenDelayedRef.current = false
    skipDelayTimerRef.current = window.setTimeout(() => {
      isOpenDelayedRef.current = true
      skipDelayTimerRef.current = null
    }, skipDelayDuration)
  }, [skipDelayDuration])

  const getOpenDelay = useCallback(
    () => (isOpenDelayedRef.current ? delayDuration : 0),
    [delayDuration],
  )

  const requestExclusiveOpen = useCallback((closeCallback: () => void) => {
    activeCloseRef.current?.()
    activeCloseRef.current = closeCallback
  }, [])

  const releaseExclusiveOpen = useCallback((closeCallback: () => void) => {
    if (activeCloseRef.current === closeCallback) {
      activeCloseRef.current = null
    }
  }, [])

  const closeActiveTooltip = useCallback(() => {
    activeCloseRef.current?.()
    activeCloseRef.current = null
  }, [])

  useEffect(
    () => () => {
      if (skipDelayTimerRef.current !== null) {
        window.clearTimeout(skipDelayTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const handleDismiss = () => closeActiveTooltip()

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const related = event.relatedTarget
      if (related instanceof Node && document.documentElement.contains(related)) {
        return
      }
      closeActiveTooltip()
    }

    window.addEventListener('blur', handleDismiss)
    window.addEventListener('scroll', handleDismiss, true)
    document.documentElement.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('blur', handleDismiss)
      window.removeEventListener('scroll', handleDismiss, true)
      document.documentElement.removeEventListener('pointerout', handlePointerOut)
    }
  }, [closeActiveTooltip])

  return (
    <TooltipGroupContext.Provider
      value={{
        delayDuration,
        skipDelayDuration,
        closeDelayDuration,
        getOpenDelay,
        onTooltipOpened,
        closeActiveTooltip,
        requestExclusiveOpen,
        releaseExclusiveOpen,
      }}
    >
      {children}
    </TooltipGroupContext.Provider>
  )
}

type TooltipRootContextValue = {
  open: boolean
  triggerRef: React.RefObject<HTMLElement | null>
  contentId: string
  scheduleOpen: () => void
  scheduleClose: () => void
  openImmediately: () => void
}

const TooltipRootContext = createContext<TooltipRootContextValue | null>(null)

function useTooltipRoot() {
  const context = useContext(TooltipRootContext)
  if (!context) {
    throw new Error('Tooltip components must be used within TooltipRoot')
  }
  return context
}

export function TooltipRoot({ children }: { children: ReactNode }) {
  const group = useTooltipGroup()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentId = useId()
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const closeTooltip = useCallback(() => {
    setOpen(false)
    group.releaseExclusiveOpen(closeTooltip)
  }, [group])

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openImmediately = useCallback(() => {
    clearTimers()
    group.requestExclusiveOpen(closeTooltip)
    setOpen(true)
    group.onTooltipOpened()
  }, [clearTimers, closeTooltip, group])

  const scheduleOpen = useCallback(() => {
    clearTimers()
    const delay = group.getOpenDelay()

    openTimerRef.current = window.setTimeout(() => {
      openImmediately()
      openTimerRef.current = null
    }, delay)
  }, [clearTimers, group, openImmediately])

  const scheduleClose = useCallback(() => {
    clearTimers()
    closeTimerRef.current = window.setTimeout(() => {
      closeTooltip()
      closeTimerRef.current = null
    }, group.closeDelayDuration)
  }, [clearTimers, closeTooltip, group.closeDelayDuration])

  useEffect(() => {
    return () => {
      clearTimers()
      group.releaseExclusiveOpen(closeTooltip)
    }
  }, [clearTimers, closeTooltip, group])

  return (
    <TooltipRootContext.Provider
      value={{
        open,
        triggerRef,
        contentId,
        scheduleOpen,
        scheduleClose,
        openImmediately,
      }}
    >
      {children}
    </TooltipRootContext.Provider>
  )
}

export function TooltipTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: ReactElement
}) {
  const {
    open,
    triggerRef,
    scheduleOpen,
    scheduleClose,
    openImmediately,
    contentId,
  } = useTooltipRoot()

  const triggerProps = {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node
    },
    'aria-describedby': open ? contentId : undefined,
    onMouseEnter: () => scheduleOpen(),
    onMouseLeave: () => scheduleClose(),
    onFocus: () => openImmediately(),
    onBlur: () => scheduleClose(),
  }

  if (asChild) {
    return renderAsChild(true, children, triggerProps)
  }

  return <span {...triggerProps}>{children}</span>
}

export function TooltipPortal({ children }: { children: ReactNode }) {
  const { open } = useTooltipRoot()
  if (!open || typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

const TOOLTIP_CONTENT_BASE = 'fv-tooltip-shell'

const PLACEMENT_MEASURE_MAX_ATTEMPTS = 24

function resolveTriggerElement(
  node: HTMLElement | null,
): HTMLElement | null {
  if (!node) return null
  if (node.getClientRects().length > 0) return node
  const firstElement = node.querySelector<HTMLElement>(
    'button, [role="button"], a[href]',
  )
  return firstElement ?? node
}

function measureContentSize(content: HTMLElement): {
  width: number
  height: number
} {
  const rect = content.getBoundingClientRect()
  let width = Math.round(rect.width)
  let height = Math.round(rect.height)

  if (width === 0) {
    width = Math.round(content.offsetWidth || content.scrollWidth)
  }
  if (height === 0) {
    height = Math.round(content.offsetHeight || content.scrollHeight)
  }

  return { width, height }
}

export function TooltipContent({
  children,
  side: preferredSide = 'top',
  sideOffset = 6,
  className,
  style,
}: {
  children: ReactNode
  side?: TooltipSide
  sideOffset?: number
  className?: string
  style?: CSSProperties
}) {
  const { open, triggerRef, contentId } = useTooltipRoot()
  const contentRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<TooltipPlacement | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null)
      return
    }

    let measureAttempts = 0

    const updatePlacement = () => {
      const trigger = resolveTriggerElement(triggerRef.current)
      const content = contentRef.current
      if (!trigger || !content) return

      const triggerRect = trigger.getBoundingClientRect()
      const { width, height } = measureContentSize(content)

      if (
        (width === 0 || height === 0) &&
        measureAttempts < PLACEMENT_MEASURE_MAX_ATTEMPTS
      ) {
        measureAttempts += 1
        requestAnimationFrame(updatePlacement)
        return
      }

      if (width === 0 || height === 0) return

      setPlacement(
        computeTooltipPlacement({
          triggerRect,
          contentWidth: width,
          contentHeight: height,
          preferredSide,
          sideOffset,
        }),
      )
    }

    updatePlacement()
    window.addEventListener('scroll', updatePlacement, true)
    window.addEventListener('resize', updatePlacement)
    return () => {
      window.removeEventListener('scroll', updatePlacement, true)
      window.removeEventListener('resize', updatePlacement)
    }
  }, [open, preferredSide, sideOffset, triggerRef])

  if (!open) return null

  const isPositioned = placement !== null

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="tooltip"
      className={[TOOLTIP_CONTENT_BASE, className].filter(Boolean).join(' ')}
      style={{
        top: placement?.top ?? -9999,
        left: placement?.left ?? -9999,
        visibility: isPositioned ? 'visible' : 'hidden',
        opacity: isPositioned ? 1 : 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
