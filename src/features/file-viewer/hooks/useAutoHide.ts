import { useState, useEffect, useRef, RefObject } from 'react'

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
  options: UseAutoHideOptions = {}
) {
  const { proximityThreshold = 160, timeout = 3000, activityDeps = [] } = options
  const [isVisible, setIsVisible] = useState(true)
  const timerRef = useRef<number | null>(null)
  const isNearRef = useRef<boolean>(false)

  // Function to start the hide timer
  const startTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => {
      setIsVisible(false)
      timerRef.current = null
    }, timeout)
  }

  // Effect to handle activity dependencies (e.g. page change)
  useEffect(() => {
    setIsVisible(true)
    // Only start the fade-out timer if the mouse isn't currently hovering near it
    if (!isNearRef.current) {
      startTimer()
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-deps
  }, activityDeps)

  // Effect to handle mouse movement inside the container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!targetRef.current) return

      const distance = getDistanceToElement(e.clientX, e.clientY, targetRef.current)
      const isNear = distance <= proximityThreshold
      
      if (isNear) {
        setIsVisible(true)
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current)
          timerRef.current = null
        }
      } else {
        // If we just moved away from the element, start the timer
        if (isNearRef.current) {
          startTimer()
        }
      }
      
      isNearRef.current = isNear
    }

    const handleMouseLeave = () => {
      isNearRef.current = false
      startTimer()
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [proximityThreshold, timeout, targetRef, containerRef])

  return isVisible
}
