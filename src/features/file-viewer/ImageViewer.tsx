'use client'

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, Scan, LoaderCircle } from './components/icons'
import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import {
  ViewerFloatingToolbar,
  ViewerToolbarDivider,
  ViewerToolbarIconButton,
} from './components/ViewerToolbar'
import { getFileViewerDefaults, resolveImageViewerProps } from './config'
import type {
  ImageViewerClassNames,
  ImageViewerStyles,
  ImageToolbarActionsContext,
  ImageToolbarActionsRenderProps,
  ViewerExtraActionsSide,
} from './customization-types'
import { useAutoHide } from './hooks/useAutoHide'
import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from './components/FileViewerTooltip'
import { calculateMultiplicativeZoom } from './utils/zoom-utils'
import { clampPanToImageBounds } from './utils/image-viewport-clamp'
import { getFileViewerTranslations, type ViewerLanguage } from './translations'
import { mergeClassNames } from './utils/merge-slot-props'
import { resolveOption } from './utils/resolve-options'
import { composeExtraActionsArea } from './utils/compose-extra-actions-area'

export type {
  ImageViewerClassNames,
  ImageViewerStyles,
  ImageToolbarActionsContext,
  ImageToolbarActionsRenderProps,
} from './customization-types'

const IMAGE_ROOT_DEFAULT = 'fv-image-root'

const IMAGE_LOADER_OVERLAY_DEFAULT = 'fv-image-loader'

const IMAGE_LOADER_ICON_DEFAULT = 'fv-icon fv-icon--xl fv-icon--spin fv-icon--white'

const IMAGE_IMG_DEFAULT = 'fv-image-img'

const IMAGE_TOOLBAR_BUILTINS_DEFAULT = 'fv-toolbar-builtins'

const IMAGE_TOOLBAR_EXTRA_DEFAULT = 'fv-toolbar-extra'

const SCALE_EPSILON = 0.012
const FIT_AT_ONE_EPSILON = 0.018
const WHEEL_VIEWPORT_CLAMP_DEBOUNCE_MS = 500
const WHEEL_CLAMP_ANIMATION_MS = 320

export interface ImageViewerProps {
  url: string
  name: string
  language?: ViewerLanguage
  classNames?: ImageViewerClassNames
  styles?: ImageViewerStyles
  extraToolbarActions?:
    | ReactNode
    | ((context: ImageToolbarActionsContext) => ReactNode)
  extraToolbarActionsSide?: ViewerExtraActionsSide
  renderToolbarActions?: (props: ImageToolbarActionsRenderProps) => ReactNode
}

export default function ImageViewer({
  url,
  name,
  language: languageProp,
  classNames: classNamesProp,
  styles: stylesProp,
  extraToolbarActions: extraToolbarActionsProp,
  extraToolbarActionsSide: extraToolbarActionsSideProp,
  renderToolbarActions: renderToolbarActionsProp,
}: ImageViewerProps) {
  const resolved = resolveImageViewerProps({
    classNames: classNamesProp,
    styles: stylesProp,
    extraToolbarActions: extraToolbarActionsProp,
    extraToolbarActionsSide: extraToolbarActionsSideProp,
    renderToolbarActions: renderToolbarActionsProp,
  })
  const classNames = resolved.classNames
  const styles = resolved.styles
  const extraToolbarActions = resolved.extraToolbarActions
  const extraToolbarActionsSide = resolveOption(
    resolved.extraToolbarActionsSide,
    undefined,
    'right',
  )
  const renderToolbarActions = resolved.renderToolbarActions

  const language = resolveOption(
    languageProp,
    getFileViewerDefaults().language,
    'english',
  )

  const imageT = getFileViewerTranslations(language).imageViewer
  const autoHideDefaults = getFileViewerDefaults().autoHide

  const imageClassName = (
    key: keyof ImageViewerClassNames,
    builtIn: string,
    extra?: string,
  ) => mergeClassNames(builtIn, classNames?.[key], extra)

  const imageStyle = (key: keyof ImageViewerStyles) => styles?.[key]
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
  const containerRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const wheelClampTimerRef = useRef<number | null>(null)
  const libraryChangeUnsubscribeRef = useRef<(() => void) | null>(null)

  const isToolbarVisible = useAutoHide(toolbarRef, containerRef, {
    proximityThreshold: autoHideDefaults?.proximityThreshold,
    timeout: autoHideDefaults?.timeout,
    activityDeps: [viewport.scale],
  })

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

  const applyWheelZoom = useCallback(
    (event: WheelEvent) => {
      if (!hasImageLoaded) return
      const ref = transformRef.current
      if (!ref) return

      event.preventDefault()
      event.stopPropagation()

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
    },
    [hasImageLoaded, maxZoom, scheduleWheelViewportClamp],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (event: WheelEvent) => {
      if (!container.contains(event.target as Node)) return
      applyWheelZoom(event)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [applyWheelZoom, hasImageLoaded])

  const zoomOutDisabled = viewport.scale <= minZoom + SCALE_EPSILON
  const zoomInDisabled = viewport.scale >= maxZoom - SCALE_EPSILON
  const nearDefaultPan =
    Math.abs(viewport.positionX) < 12 && Math.abs(viewport.positionY) < 12
  const fitDisabled =
    Math.abs(viewport.scale - 1) < FIT_AT_ONE_EPSILON && nearDefaultPan

  const wrapperClassName = isPanning
    ? 'fv-transform-wrapper fv-transform-wrapper--panning'
    : 'fv-transform-wrapper'

  return (
    <FileViewerTooltipProvider>
      <div
        ref={containerRef}
        className={imageClassName('root', IMAGE_ROOT_DEFAULT)}
        style={imageStyle('root')}
      >
        {!hasImageLoaded ? (
          <div
            className={imageClassName('loader', IMAGE_LOADER_OVERLAY_DEFAULT)}
            style={imageStyle('loader')}
            aria-busy
            aria-live="polite"
          >
            <LoaderCircle className={IMAGE_LOADER_ICON_DEFAULT} aria-hidden />
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
          {({ zoomIn, zoomOut, resetTransform }) => {
            const handleResetTransform = () => {
              resetTransform()
              updateScaleText(1)
            }

            const buildToolbarActionsContext = (): ImageToolbarActionsContext => ({
              scale: viewport.scale,
              zoomIn,
              zoomOut,
              resetTransform: handleResetTransform,
            })

            const buildDefaultToolbarActions = (): ReactNode => (
              <>
                <span ref={scaleRef} className="fv-toolbar-scale-label">
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
                    <ZoomOut className="fv-icon fv-icon--sm" />
                  </ViewerToolbarIconButton>
                </FileViewerTooltip>

                <FileViewerTooltip
                  content={imageT.fitScreenTooltip}
                  disabled={fitDisabled}
                >
                  <ViewerToolbarIconButton
                    disabled={fitDisabled}
                    onClick={handleResetTransform}
                    aria-label={imageT.fitScreenAriaLabel}
                  >
                    <Scan className="fv-icon fv-icon--sm" />
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
                    <ZoomIn className="fv-icon fv-icon--sm" />
                  </ViewerToolbarIconButton>
                </FileViewerTooltip>
              </>
            )

            const renderExtraToolbarActions = (
              context: ImageToolbarActionsContext,
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
                builtinsClassName: imageClassName(
                  'toolbarBuiltins',
                  IMAGE_TOOLBAR_BUILTINS_DEFAULT,
                ),
                extraClassName: imageClassName(
                  'toolbarExtra',
                  IMAGE_TOOLBAR_EXTRA_DEFAULT,
                ),
                builtinsStyle: imageStyle('toolbarBuiltins'),
                extraStyle: imageStyle('toolbarExtra'),
              })
            }

            return (
              <>
                <TransformComponent
                  wrapperClass={wrapperClassName}
                  contentClass="fv-transform-content"
                >
                  <img
                    src={url}
                    alt={name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={imageClassName('image', IMAGE_IMG_DEFAULT)}
                    style={imageStyle('image')}
                  />
                </TransformComponent>

                <ViewerFloatingToolbar
                  ref={toolbarRef}
                  className={imageClassName('toolbar', 'fv-floating-toolbar')}
                  style={imageStyle('toolbar')}
                  data-toolbar-visible={isToolbarVisible}
                >
                  {renderToolbarActionsArea()}
                </ViewerFloatingToolbar>
              </>
            )
          }}
        </TransformWrapper>
      </div>
    </FileViewerTooltipProvider>
  )
}
