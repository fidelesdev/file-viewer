import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, Scan, LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ViewerFloatingToolbar,
  ViewerToolbarDivider,
  ViewerToolbarIconButton,
} from './components/ViewerToolbar'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import { calculateMultiplicativeZoom } from './utils/zoom-utils'
import { clampPanToImageBounds } from './utils/image-viewport-clamp'
import { getFileViewerTranslations, type ViewerLanguage } from './translations'

const SCALE_EPSILON = 0.012
const FIT_AT_ONE_EPSILON = 0.018
const WHEEL_VIEWPORT_CLAMP_DEBOUNCE_MS = 500
const WHEEL_CLAMP_ANIMATION_MS = 320

export interface ImageViewerProps {
  url: string
  name: string
  language?: ViewerLanguage
}

export default function ImageViewer({ url, name, language = 'english' }: ImageViewerProps) {
  const imageT = getFileViewerTranslations(language).imageViewer
  const [maxZoom, setMaxZoom] = useState(16)
  const [isPanning, setIsPanning] = useState(false)
  const [hasImageLoaded, setHasImageLoaded] = useState(false)
  const [viewport, setViewport] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  })
  const minZoom = 0.5
  const scaleRef = useRef<HTMLSpanElement>(null)
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null)
  const wheelClampTimerRef = useRef<number | null>(null)
  const libraryChangeUnsubscribeRef = useRef<(() => void) | null>(null)

  const updateScaleText = useCallback((scale: number) => {
    if (scaleRef.current) {
      scaleRef.current.innerText = `${Math.round(scale * 100)}%`
    }
  }, [])

  const syncViewportFromLibrary = useCallback(
    (libraryRef: ReactZoomPanPinchRef) => {
      const { scale, positionX, positionY } = libraryRef.instance.state
      setViewport({ scale, positionX, positionY })
      updateScaleText(scale)
    },
    [updateScaleText],
  )

  const handleLibraryInit = useCallback(
    (libraryRef: ReactZoomPanPinchRef) => {
      libraryChangeUnsubscribeRef.current?.()
      libraryChangeUnsubscribeRef.current = null
      syncViewportFromLibrary(libraryRef)
      libraryChangeUnsubscribeRef.current = libraryRef.instance.onChange(
        (nextRef) => {
          syncViewportFromLibrary(nextRef)
        },
      )
    },
    [syncViewportFromLibrary],
  )

  const scheduleWheelViewportClamp = useCallback(() => {
    if (wheelClampTimerRef.current !== null) {
      clearTimeout(wheelClampTimerRef.current)
    }
    wheelClampTimerRef.current = window.setTimeout(() => {
      wheelClampTimerRef.current = null
      const ref = transformRef.current
      if (!ref) return
      const { instance } = ref
      const { scale, positionX, positionY } = instance.state
      const wrapper = instance.wrapperComponent
      const content = instance.contentComponent
      if (!wrapper || !content) return

      const setup = instance.setup
      const clamped = clampPanToImageBounds(
        wrapper,
        content,
        scale,
        positionX,
        positionY,
        {
          centerZoomedOut: Boolean(setup.centerZoomedOut),
          disablePadding: Boolean(setup.disablePadding),
          minPositionX: setup.minPositionX ?? null,
          maxPositionX: setup.maxPositionX ?? null,
          minPositionY: setup.minPositionY ?? null,
          maxPositionY: setup.maxPositionY ?? null,
          limitToBounds: Boolean(setup.limitToBounds),
        },
      )

      if (
        Math.abs(clamped.positionX - positionX) > 0.01 ||
        Math.abs(clamped.positionY - positionY) > 0.01
      ) {
        ref.setTransform(
          clamped.positionX,
          clamped.positionY,
          scale,
          WHEEL_CLAMP_ANIMATION_MS,
          'easeOut',
        )
      }
    }, WHEEL_VIEWPORT_CLAMP_DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (wheelClampTimerRef.current !== null) {
        clearTimeout(wheelClampTimerRef.current)
      }
      libraryChangeUnsubscribeRef.current?.()
      libraryChangeUnsubscribeRef.current = null
    }
  }, [])

  useEffect(() => {
    setHasImageLoaded(false)
  }, [url])

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    const naturalWidth = img.naturalWidth
    const currentWidth = img.clientWidth

    if (naturalWidth && currentWidth) {
      const nativeScale = naturalWidth / currentWidth
      // Floor 4x (400%), ceiling 16x (1600%), or 2x native resolution
      const calculatedMax = Math.max(4, Math.min(16, nativeScale * 2))
      setMaxZoom(calculatedMax)
    }
    setHasImageLoaded(true)
  }

  const handleImageError = () => {
    setHasImageLoaded(true)
  }

  const handleWheelZoom = (event: React.WheelEvent) => {
    if (!hasImageLoaded) return
    const ref = transformRef.current
    if (!ref) return

    const { scale, positionX, positionY } = ref.state

    const { newX, newY, newScale } = calculateMultiplicativeZoom({
      scale,
      positionX,
      positionY,
      deltaY: event.deltaY,
      clientX: event.clientX,
      clientY: event.clientY,
      wrapperComponent: ref.instance.wrapperComponent,
      minScale: minZoom,
      maxScale: maxZoom,
    })

    if (newScale !== scale) {
      ref.setTransform(newX, newY, newScale, 0)
      scheduleWheelViewportClamp()
    }
  }

  const zoomOutDisabled = viewport.scale <= minZoom + SCALE_EPSILON
  const zoomInDisabled = viewport.scale >= maxZoom - SCALE_EPSILON
  const nearDefaultPan =
    Math.abs(viewport.positionX) < 12 && Math.abs(viewport.positionY) < 12
  const fitDisabled =
    Math.abs(viewport.scale - 1) < FIT_AT_ONE_EPSILON && nearDefaultPan

  const wrapperCursorClass = isPanning ? 'cursor-move' : ''

  return (
    <FileViewerTooltipProvider>
      <div
        className="relative flex size-full items-center justify-center overflow-hidden"
        onWheel={handleWheelZoom}
      >
        {!hasImageLoaded ? (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-950/40"
            aria-busy
            aria-live="polite"
          >
            <LoaderCircle className="size-10 animate-spin text-white" aria-hidden />
          </div>
        ) : null}

        <TransformWrapper
          key={url}
          ref={transformRef}
          initialScale={1}
          minScale={minZoom}
          maxScale={maxZoom}
          centerOnInit
          limitToBounds
          wheel={{ disabled: true }}
          onInit={handleLibraryInit}
          onPanningStart={() => setIsPanning(true)}
          onPanningStop={() => setIsPanning(false)}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent
                wrapperClass={`!size-full ${wrapperCursorClass}`}
                contentClass="!size-full flex items-center justify-center"
              >
                <img
                  src={url}
                  alt={name}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className="max-h-[calc(100dvh-10rem)] max-w-full shadow"
                />
              </TransformComponent>

              <ViewerFloatingToolbar density="compact">
                <span
                  ref={scaleRef}
                  className="w-12 text-center text-sm font-medium text-white/90"
                >
                  100%
                </span>

                <ViewerToolbarDivider />

                <FileViewerTooltip
                  content={imageT.zoomOutTooltip}
                  disabled={zoomOutDisabled}
                >
                  <ViewerToolbarIconButton
                    disabled={zoomOutDisabled}
                    onClick={() => zoomOut()}
                    aria-label={imageT.zoomOutAriaLabel}
                  >
                    <ZoomOut className="size-5" />
                  </ViewerToolbarIconButton>
                </FileViewerTooltip>

                <FileViewerTooltip
                  content={imageT.fitScreenTooltip}
                  disabled={fitDisabled}
                >
                  <ViewerToolbarIconButton
                    disabled={fitDisabled}
                    onClick={() => {
                      resetTransform()
                      updateScaleText(1)
                    }}
                    aria-label={imageT.fitScreenAriaLabel}
                  >
                    <Scan className="size-5" />
                  </ViewerToolbarIconButton>
                </FileViewerTooltip>

                <FileViewerTooltip
                  content={imageT.zoomInTooltip}
                  disabled={zoomInDisabled}
                >
                  <ViewerToolbarIconButton
                    disabled={zoomInDisabled}
                    onClick={() => zoomIn()}
                    aria-label={imageT.zoomInAriaLabel}
                  >
                    <ZoomIn className="size-5" />
                  </ViewerToolbarIconButton>
                </FileViewerTooltip>
              </ViewerFloatingToolbar>
            </>
          )}
        </TransformWrapper>
      </div>
    </FileViewerTooltipProvider>
  )
}
