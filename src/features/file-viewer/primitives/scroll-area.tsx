import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { mergeClassNames } from '../utils/merge-slot-props'
import {
  getScrollPositionFromPointer,
  getThumbOffsetFromScroll,
  getThumbSize,
  hasScrollAreaThumb,
  type ScrollAreaSizes,
} from './scroll-area-math'

const EMPTY_SIZES: ScrollAreaSizes = {
  content: 0,
  viewport: 0,
  scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
}

type ScrollAreaContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>
  cornerWidth: number
  cornerHeight: number
  setCornerWidth: (width: number) => void
  setCornerHeight: (height: number) => void
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null)

function useScrollAreaContext(component: string): ScrollAreaContextValue {
  const context = useContext(ScrollAreaContext)
  if (!context) {
    throw new Error(`${component} must be used within ScrollAreaRoot`)
  }
  return context
}

function assignRef<T>(ref: Ref<T> | undefined, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  if (ref && typeof ref === 'object') {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (value: T) => void {
  return (value: T) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
}

function readScrollbarPadding(track: HTMLElement) {
  const computed = getComputedStyle(track)
  return {
    paddingStart: Number.parseInt(computed.paddingTop, 10) || 0,
    paddingEnd: Number.parseInt(computed.paddingBottom, 10) || 0,
    paddingLeft: Number.parseInt(computed.paddingLeft, 10) || 0,
    paddingRight: Number.parseInt(computed.paddingRight, 10) || 0,
  }
}

type ScrollAreaRootProps = HTMLAttributes<HTMLDivElement>

export function ScrollAreaRoot({
  className,
  style,
  children,
  ...rest
}: ScrollAreaRootProps & { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [cornerWidth, setCornerWidth] = useState(0)
  const [cornerHeight, setCornerHeight] = useState(0)

  return (
    <ScrollAreaContext.Provider
      value={{
        viewportRef,
        cornerWidth,
        cornerHeight,
        setCornerWidth,
        setCornerHeight,
      }}
    >
      <div
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ['--scroll-area-corner-width' as string]: `${cornerWidth}px`,
          ['--scroll-area-corner-height' as string]: `${cornerHeight}px`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </ScrollAreaContext.Provider>
  )
}

type ScrollAreaViewportProps = HTMLAttributes<HTMLDivElement>

export const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  ({ className, children, onScroll, ...rest }, forwardedRef) => {
    const { viewportRef } = useScrollAreaContext('ScrollAreaViewport')

    return (
      <div
        ref={mergeRefs(forwardedRef, viewportRef)}
        onScroll={onScroll}
        className={mergeClassNames(
          'size-full overflow-x-scroll overflow-y-scroll pdf-scroll-viewport',
          className,
        )}
        {...rest}
      >
        <div
          className="scroll-area-viewport-inner"
          style={{ minWidth: '100%', display: 'table' }}
        >
          {children}
        </div>
      </div>
    )
  },
)
ScrollAreaViewport.displayName = 'ScrollAreaViewport'

type ScrollAreaScrollbarProps = HTMLAttributes<HTMLDivElement> & {
  orientation: 'vertical' | 'horizontal'
  children: ReactElement
}

export function ScrollAreaScrollbar({
  orientation,
  className,
  style,
  children,
  ...rest
}: ScrollAreaScrollbarProps) {
  const context = useScrollAreaContext('ScrollAreaScrollbar')
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const pointerOffsetRef = useRef(0)
  const [sizes, setSizes] = useState<ScrollAreaSizes>(EMPTY_SIZES)

  const isVertical = orientation === 'vertical'
  const showThumb = hasScrollAreaThumb(sizes)

  const updateSizes = useCallback(() => {
    const viewport = context.viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const padding = readScrollbarPadding(track)

    if (isVertical) {
      setSizes({
        content: viewport.scrollHeight,
        viewport: viewport.offsetHeight,
        scrollbar: {
          size: track.clientHeight,
          paddingStart: padding.paddingStart,
          paddingEnd: padding.paddingEnd,
        },
      })
      context.setCornerWidth(track.offsetWidth)
      return
    }

    setSizes({
      content: viewport.scrollWidth,
      viewport: viewport.offsetWidth,
      scrollbar: {
        size: track.clientWidth,
        paddingStart: padding.paddingLeft,
        paddingEnd: padding.paddingRight,
      },
    })
    context.setCornerHeight(track.offsetHeight)
  }, [context, isVertical])

  const updateThumbPosition = useCallback(() => {
    const viewport = context.viewportRef.current
    const thumb = thumbRef.current
    if (!viewport || !thumb || !showThumb) return

    const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft
    const offset = getThumbOffsetFromScroll(scrollPos, sizes)

    thumb.style.transform = isVertical
      ? `translate3d(0, ${offset}px, 0)`
      : `translate3d(${offset}px, 0, 0)`
  }, [context.viewportRef, isVertical, showThumb, sizes])

  useEffect(() => {
    const viewport = context.viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const runUpdate = () => {
      requestAnimationFrame(updateSizes)
    }

    runUpdate()

    const resizeObserver = new ResizeObserver(runUpdate)
    resizeObserver.observe(viewport)
    resizeObserver.observe(track)

    const contentRoot = viewport.firstElementChild
    if (contentRoot) {
      resizeObserver.observe(contentRoot)
    }

    const mutationObserver = new MutationObserver(runUpdate)
    mutationObserver.observe(viewport, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [context.viewportRef, updateSizes])

  useEffect(() => {
    updateThumbPosition()
  }, [sizes, updateThumbPosition])

  useEffect(() => {
    const viewport = context.viewportRef.current
    if (!viewport) return

    let frame = 0
    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        updateThumbPosition()
        frame = 0
      })
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [context.viewportRef, updateThumbPosition])

  const getPointerOnTrack = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current
      if (!track) return 0

      const rect = track.getBoundingClientRect()
      return isVertical ? clientY - rect.top : clientX - rect.left
    },
    [isVertical],
  )

  const setScrollFromPointer = useCallback(
    (pointerPos: number) => {
      const viewport = context.viewportRef.current
      if (!viewport) return

      const scrollPos = getScrollPositionFromPointer(
        pointerPos,
        pointerOffsetRef.current,
        sizes,
      )

      if (isVertical) {
        viewport.scrollTop = scrollPos
      } else {
        viewport.scrollLeft = scrollPos
      }
    },
    [context.viewportRef, isVertical, sizes],
  )

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    const track = trackRef.current
    if (!track) return

    if (event.target === track) {
      pointerOffsetRef.current = 0
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    setScrollFromPointer(getPointerOnTrack(event.clientX, event.clientY))
  }

  const handleTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return
    }

    setScrollFromPointer(getPointerOnTrack(event.clientX, event.clientY))
  }

  const handleTrackPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    pointerOffsetRef.current = 0
  }

  const thumbProps = children.props as HTMLAttributes<HTMLDivElement>
  const thumbClassName = thumbProps.className
  const thumbStyleProp = thumbProps.style
  const {
    className: _ignoredClassName,
    style: _ignoredStyle,
    ...thumbRest
  } = thumbProps

  const thumbSizePx = getThumbSize(sizes)

  const thumbDimensionStyle: CSSProperties = isVertical
    ? { height: thumbSizePx, width: '100%' }
    : { width: thumbSizePx, height: '100%' }

  const trackStyle: CSSProperties = isVertical
    ? {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 'var(--scroll-area-corner-height)',
      }
    : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 'var(--scroll-area-corner-width)',
      }

  return (
    <div
      ref={trackRef}
      data-orientation={orientation}
      className={className}
      style={{ ...trackStyle, ...style }}
      onPointerDown={handleTrackPointerDown}
      onPointerMove={handleTrackPointerMove}
      onPointerUp={handleTrackPointerUp}
      onPointerCancel={handleTrackPointerUp}
      {...rest}
    >
      {showThumb ? (
        <div
          ref={thumbRef}
          data-state="visible"
          className={thumbClassName}
          style={{
            flex: 'none',
            ...thumbDimensionStyle,
            ...thumbStyleProp,
          }}
          onPointerDownCapture={(event: PointerEvent<HTMLDivElement>) => {
            thumbProps.onPointerDownCapture?.(event)
            const thumbRect = event.currentTarget.getBoundingClientRect()
            pointerOffsetRef.current = isVertical
              ? event.clientY - thumbRect.top
              : event.clientX - thumbRect.left
          }}
          {...thumbRest}
        />
      ) : null}
    </div>
  )
}

type ScrollAreaThumbProps = HTMLAttributes<HTMLDivElement>

export function ScrollAreaThumb({ className, style, ...rest }: ScrollAreaThumbProps) {
  return (
    <div
      data-state="hidden"
      className={className}
      style={style}
      {...rest}
    />
  )
}

type ScrollAreaCornerProps = HTMLAttributes<HTMLDivElement>

export function ScrollAreaCorner({ className, style, ...rest }: ScrollAreaCornerProps) {
  const { cornerWidth, cornerHeight } = useScrollAreaContext('ScrollAreaCorner')

  if (!cornerWidth || !cornerHeight) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: cornerWidth,
        height: cornerHeight,
        ...style,
      }}
      {...rest}
    />
  )
}
