import { useState, useEffect, useRef, useCallback, type RefObject } from 'react'

/**
 * Calculates the shortest distance between a point (x, y) and a DOM element's bounding box.
 * Returns 0 if the point is inside the element.
 */
export function getDistanceToElement(x: number, y: number, element: Element): number {
  const rect = element.getBoundingClientRect()
  const dx = Math.max(rect.left - x, 0, x - rect.right)
  const dy = Math.max(rect.top - y, 0, y - rect.bottom)
  return Math.sqrt(dx * dx + dy * dy)
}

function isFocusWithinElement(element: HTMLElement | null): boolean {
  if (!element || typeof document === 'undefined') {
    return false
  }
  const active = document.activeElement
  return active instanceof Node && element.contains(active)
}

interface UseAutoHideOptions {
  /** Distance in pixels to consider the cursor "near" the target */
  proximityThreshold?: number
  /** Time in milliseconds to wait before hiding the target */
  timeout?: number
  /** Any state changes that should force the target to become visible briefly */
  activityDeps?: unknown[]
}

export function useAutoHide(
  targetRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  options: UseAutoHideOptions = {},
) {
  const { proximityThreshold = 160, timeout = 3000, activityDeps = [] } = options
  const [isVisible, setIsVisible] = useState(true)
  const timerRef = useRef<number | null>(null)
  const isNearRef = useRef(false)
  const hasFocusWithinRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const syncFocusWithinTarget = useCallback(() => {
    hasFocusWithinRef.current = isFocusWithinElement(targetRef.current)
  }, [targetRef])

  const shouldStayVisible = useCallback(() => {
    return isNearRef.current || hasFocusWithinRef.current
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      syncFocusWithinTarget()
      if (shouldStayVisible()) {
        return
      }
      setIsVisible(false)
      timerRef.current = null
    }, timeout)
  }, [clearTimer, shouldStayVisible, syncFocusWithinTarget, timeout])

  const showTarget = useCallback(() => {
    setIsVisible(true)
    clearTimer()
  }, [clearTimer])

  const scheduleHideIfAllowed = useCallback(() => {
    syncFocusWithinTarget()
    if (shouldStayVisible()) {
      showTarget()
      return
    }
    startTimer()
  }, [shouldStayVisible, showTarget, startTimer, syncFocusWithinTarget])

  // Effect to handle activity dependencies (e.g. page change)
  useEffect(() => {
    showTarget()
    if (!shouldStayVisible()) {
      startTimer()
    }
    return clearTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps -- activityDeps is intentional
  }, activityDeps)

  // Keep toolbar visible while focus is inside (e.g. page number input)
  useEffect(() => {
    const target = targetRef.current
    if (!target) {
      return
    }

    const handleFocusIn = () => {
      hasFocusWithinRef.current = true
      showTarget()
    }

    const handleFocusOut = () => {
      window.requestAnimationFrame(() => {
        syncFocusWithinTarget()
        if (hasFocusWithinRef.current) {
          showTarget()
          return
        }
        scheduleHideIfAllowed()
      })
    }

    target.addEventListener('focusin', handleFocusIn)
    target.addEventListener('focusout', handleFocusOut)

    return () => {
      target.removeEventListener('focusin', handleFocusIn)
      target.removeEventListener('focusout', handleFocusOut)
    }
  }, [targetRef, showTarget, scheduleHideIfAllowed, syncFocusWithinTarget])

  // Effect to handle mouse movement inside the container
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const target = targetRef.current
      if (!target) {
        return
      }

      const distance = getDistanceToElement(
        event.clientX,
        event.clientY,
        target,
      )
      const isNear = distance <= proximityThreshold

      if (isNear) {
        isNearRef.current = true
        showTarget()
      } else if (isNearRef.current) {
        isNearRef.current = false
        scheduleHideIfAllowed()
      } else {
        isNearRef.current = false
      }
    }

    const handleMouseLeave = () => {
      isNearRef.current = false
      scheduleHideIfAllowed()
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [
    proximityThreshold,
    targetRef,
    containerRef,
    showTarget,
    scheduleHideIfAllowed,
  ])

  return isVisible
}
