export interface ZoomParams {
  scale: number
  positionX: number
  positionY: number
  deltaY: number
  clientX: number
  clientY: number
  wrapperComponent: HTMLDivElement | null
  minScale?: number
  maxScale?: number
  zoomFactor?: number
}

export function calculateMultiplicativeZoom({
  scale,
  positionX,
  positionY,
  deltaY,
  clientX,
  clientY,
  wrapperComponent,
  minScale = 0.2,
  maxScale = 8,
  zoomFactor = 0.15,
}: ZoomParams) {
  const isZoomIn = deltaY < 0
  const factor = isZoomIn ? 1 + zoomFactor : 1 / (1 + zoomFactor)

  const newScale = Math.max(minScale, Math.min(scale * factor, maxScale))

  if (newScale === scale || !wrapperComponent) {
    return { newX: positionX, newY: positionY, newScale: scale }
  }

  const rect = wrapperComponent.getBoundingClientRect()
  const mx = clientX - rect.left
  const my = clientY - rect.top

  const ratio = newScale / scale
  const newX = mx - (mx - positionX) * ratio
  const newY = my - (my - positionY) * ratio

  return { newX, newY, newScale }
}
