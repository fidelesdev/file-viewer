/**
 * Viewport clamping aligned with react-zoom-pan-pinch bounds (MIT).
 * Used after programmatic wheel zoom so the image stays reachable without centering.
 */

export type ImagePanBounds = {
  minPositionX: number
  maxPositionX: number
  minPositionY: number
  maxPositionY: number
}

type ComponentsSizes = {
  wrapperWidth: number
  wrapperHeight: number
  newContentWidth: number
  newDiffWidth: number
  newContentHeight: number
  newDiffHeight: number
}

function roundNumber(num: number, decimal: number): number {
  return Number(num.toFixed(decimal))
}

function getComponentsSizes(
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
  newScale: number,
): ComponentsSizes {
  const wrapperWidth = wrapperComponent.offsetWidth
  const wrapperHeight = wrapperComponent.offsetHeight
  const contentWidth = contentComponent.offsetWidth
  const contentHeight = contentComponent.offsetHeight
  const newContentWidth = contentWidth * newScale
  const newContentHeight = contentHeight * newScale
  const newDiffWidth = wrapperWidth - newContentWidth
  const newDiffHeight = wrapperHeight - newContentHeight
  return {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  }
}

function getBoundsFromSizes(
  wrapperWidth: number,
  newContentWidth: number,
  diffWidth: number,
  wrapperHeight: number,
  newContentHeight: number,
  diffHeight: number,
  centerZoomedOut: boolean,
): ImagePanBounds {
  const scaleWidthFactor =
    wrapperWidth > newContentWidth ? diffWidth * (centerZoomedOut ? 0.5 : 1) : 0
  const scaleHeightFactor =
    wrapperHeight > newContentHeight ? diffHeight * (centerZoomedOut ? 0.5 : 1) : 0
  const minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor
  const maxPositionX = scaleWidthFactor
  const minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor
  const maxPositionY = scaleHeightFactor
  return {
    minPositionX,
    maxPositionX,
    minPositionY,
    maxPositionY,
  }
}

function boundLimiter(
  value: number,
  minBound: number,
  maxBound: number,
  isActive: boolean,
): number {
  if (!isActive) return roundNumber(value, 2)
  if (value < minBound) return roundNumber(minBound, 2)
  if (value > maxBound) return roundNumber(maxBound, 2)
  return roundNumber(value, 2)
}

function getMouseBoundedPosition(
  positionX: number,
  positionY: number,
  bounds: ImagePanBounds,
  limitToBounds: boolean,
  paddingValueX: number,
  paddingValueY: number,
  wrapperComponent: HTMLDivElement | null,
): { x: number; y: number } {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds
  const paddingX = wrapperComponent ? paddingValueX : 0
  const paddingY = wrapperComponent ? paddingValueY : 0
  const x = boundLimiter(
    positionX,
    minPositionX - paddingX,
    maxPositionX + paddingX,
    limitToBounds,
  )
  const y = boundLimiter(
    positionY,
    minPositionY - paddingY,
    maxPositionY + paddingY,
    limitToBounds,
  )
  return { x, y }
}

export type ImageClampSetup = {
  centerZoomedOut: boolean
  disablePadding: boolean
  minPositionX: number | null
  maxPositionX: number | null
  minPositionY: number | null
  maxPositionY: number | null
  limitToBounds: boolean
}

/**
 * Clamps pan (x, y) to the same bounds the library uses for panning, without changing scale.
 */
export function clampPanToImageBounds(
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
  scale: number,
  positionX: number,
  positionY: number,
  setup: ImageClampSetup,
): { positionX: number; positionY: number } {
  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newContentHeight,
    newDiffWidth,
    newDiffHeight,
  } = getComponentsSizes(wrapperComponent, contentComponent, scale)

  const bounds = getBoundsFromSizes(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    Boolean(setup.centerZoomedOut),
  )

  const contentFitsCompletely =
    wrapperWidth >= newContentWidth && wrapperHeight >= newContentHeight
  if (setup.disablePadding && contentFitsCompletely && !setup.centerZoomedOut) {
    bounds.minPositionX = 0
    bounds.maxPositionX = 0
    bounds.minPositionY = 0
    bounds.maxPositionY = 0
  }

  const {
    minPositionX: propMinX,
    maxPositionX: propMaxX,
    minPositionY: propMinY,
    maxPositionY: propMaxY,
  } = setup

  if (propMinX != null) {
    bounds.minPositionX = wrapperWidth * (1 - scale) + propMinX * scale
  }
  if (propMaxX != null) {
    bounds.maxPositionX = propMaxX * scale
  }
  if (propMinY != null) {
    bounds.minPositionY = wrapperHeight * (1 - scale) + propMinY * scale
  }
  if (propMaxY != null) {
    bounds.maxPositionY = propMaxY * scale
  }

  const { x, y } = getMouseBoundedPosition(
    positionX,
    positionY,
    bounds,
    setup.limitToBounds,
    0,
    0,
    wrapperComponent,
  )
  return { positionX: x, positionY: y }
}
